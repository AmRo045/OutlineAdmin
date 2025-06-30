/* eslint-disable no-console */
import { AccessKey, Server } from "@prisma/client";

import { MAX_DATA_LIMIT_FOR_ACCESS_KEYS } from "../config";

import prisma from "@/prisma/db";
import OutlineClient from "@/src/core/outline/outline-client";
import { DataLimitUnit, Outline } from "@/src/core/definitions";

export class OutlineSyncService {
    protected client: OutlineClient;

    constructor(protected readonly server: Server) {
        this.client = OutlineClient.fromConfig(server.managementJson);
    }

    async sync(): Promise<void> {
        const maxAttempts = 3;
        let attempts = 0;

        let remoteServerInfo: Outline.Server | undefined;

        do {
            try {
                console.log("Getting server info from remote server...");
                remoteServerInfo = await this.client.server();
            } catch (error) {
                console.error(`Attempt #${attempts + 1} failed: ${error}\n`);
                attempts++;
            }
        } while (!remoteServerInfo && attempts < maxAttempts);

        if (remoteServerInfo) {
            console.log("Getting server usage metrics...");
            const metrics = await this.client.metricsTransfer();

            const allMetrics = Object.values(metrics.bytesTransferredByUserId);
            const totalUsageMetrics = allMetrics.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
            );

            console.log("Updating server info in local database...");
            await prisma.server.update({
                where: { id: this.server.id },
                data: {
                    name: remoteServerInfo.name,
                    hostnameOrIp: remoteServerInfo.hostnameForAccessKeys,
                    hostnameForNewAccessKeys: remoteServerInfo.hostnameForAccessKeys,
                    portForNewAccessKeys: remoteServerInfo.portForNewAccessKeys,
                    isMetricsEnabled: remoteServerInfo.metricsEnabled,
                    totalDataUsage: totalUsageMetrics,
                    isAvailable: true
                }
            });

            await this.syncAccessKeys(metrics);
        } else {
            console.log("Changing server status to unavailable...");
            await prisma.server.update({
                where: { id: this.server.id },
                data: {
                    isAvailable: false
                }
            });
        }
    }

    protected async syncAccessKeys(metrics: Outline.Metrics): Promise<void> {
        console.log("\nLoading servers access keys from local database...");
        const localAccessKeys = await prisma.accessKey.findMany({
            where: {
                serverId: this.server.id
            }
        });

        console.log("Getting server access keys...");
        const remoteAccessKeys = await this.client.keys();

        for (const remoteAccessKey of remoteAccessKeys) {
            console.log(`\n----->{${remoteAccessKey.name} (${remoteAccessKey.id})}`);
            const localAccessKey = localAccessKeys.find(
                (localAccessKey) => localAccessKey.apiId === remoteAccessKey.id
            );

            const dataLimitUnit = localAccessKey
                ? (localAccessKey.dataLimitUnit as DataLimitUnit)
                : DataLimitUnit.Bytes;

            const dataLimit = remoteAccessKey.dataLimitInBytes
                ? this.convertDataLimitToUnit(remoteAccessKey.dataLimitInBytes, dataLimitUnit)
                : null;

            if (localAccessKey) {
                // this means we need to update the access key
                console.log(`Updating access key info in local database...`);

                let accessKeyName = remoteAccessKey.name;

                if (accessKeyName.length === 0) {
                    accessKeyName = `Key #${remoteAccessKey.id}`;
                }
                await prisma.accessKey.update({
                    where: { id: localAccessKey.id },
                    data: {
                        name: accessKeyName,
                        dataLimit: dataLimit,
                        dataUsage: metrics.bytesTransferredByUserId[remoteAccessKey.id]
                    }
                });

                if (this.isAccessKeyExpired(localAccessKey)) {
                    console.log("Disabling access key due to expiration date...");
                    await this.disableExpiredAccessKey(localAccessKey);
                }
            } else {
                // and this means we need to create the access key
                console.log(`Creating missing access key in local database...`);

                await prisma.accessKey.create({
                    data: {
                        serverId: this.server.id,
                        name: remoteAccessKey.name,
                        prefix: null,
                        expiresAt: null,
                        dataLimit: dataLimit,
                        dataLimitUnit: DataLimitUnit.Bytes,
                        apiId: remoteAccessKey.id,
                        accessUrl: remoteAccessKey.accessUrl,
                        method: remoteAccessKey.method,
                        password: remoteAccessKey.password,
                        port: remoteAccessKey.port
                    }
                });
            }
        }

        console.log("\nRemoving access keys that does not exist in remote server...");

        const localAccessKeysToRemove = [];

        for (const localAccessKey of localAccessKeys) {
            if (remoteAccessKeys.find((remoteAccessKey) => remoteAccessKey.id === localAccessKey.apiId)) {
                continue;
            }

            console.log(`\n----->{${localAccessKey.name} (${localAccessKey.apiId})}`);
            localAccessKeysToRemove.push(localAccessKey.id);
        }

        if (localAccessKeysToRemove.length > 0) {
            console.log("Removing access keys from local database...", localAccessKeysToRemove);

            await prisma.accessKey.deleteMany({
                where: {
                    id: {
                        in: localAccessKeysToRemove
                    }
                }
            });
        } else {
            console.log("There is no access key to remove");
        }
    }

    protected isAccessKeyExpired(accessKey: AccessKey): boolean {
        if (!accessKey.expiresAt) {
            return false;
        }

        console.log("Checking for access key expiration date...");

        return accessKey.expiresAt <= new Date();
    }

    protected async disableExpiredAccessKey(accessKey: AccessKey): Promise<void> {
        try {
            const disabledAccessKeyLimitInBytes = 1000;

            await this.client.removeDataLimitForKey(accessKey.apiId);
            await this.client.setDataLimitForKey(accessKey.apiId, disabledAccessKeyLimitInBytes);

            await prisma.accessKey.update({
                where: { id: accessKey.id },
                data: {
                    dataLimit: disabledAccessKeyLimitInBytes,
                    dataLimitUnit: DataLimitUnit.Bytes
                }
            });
        } catch (error) {
            console.error(`Attempt to disabling access key failed: ${error}\n`);
        }
    }

    protected convertDataLimitToUnit(value: number, unit: DataLimitUnit): number {
        const unitFactors: Map<DataLimitUnit, number> = new Map([
            [DataLimitUnit.Bytes, 1],
            [DataLimitUnit.KB, 1024],
            [DataLimitUnit.MB, 1000 * 1000],
            [DataLimitUnit.GB, 1000 * 1000 * 1000]
        ]);

        const safeValue = Math.min(value, MAX_DATA_LIMIT_FOR_ACCESS_KEYS);

        return safeValue * (unitFactors.get(unit) ?? 1);
    }
}

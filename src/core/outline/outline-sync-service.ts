/* eslint-disable no-console */
import { AccessKey, Server } from "@prisma/client";
import { Logger } from "winston";

import { BYTES_TO_MB_RATE } from "../config";

import prisma from "@/prisma/db";
import OutlineClient from "@/src/core/outline/outline-client";
import { DataLimitUnit, LoggerContext, Outline } from "@/src/core/definitions";
import { createLogger } from "@/src/core/logger";

export class OutlineSyncService {
    protected client: OutlineClient;
    protected logger: Logger;

    constructor(protected readonly server: Server) {
        this.client = OutlineClient.fromConfig(server.managementJson);
        this.logger = createLogger(LoggerContext.OutlineSyncJob);
    }

    async sync(): Promise<void> {
        if (!this.server.isAvailable) {
            this.logger.warn(`Server ${this.server.name} (${this.server.hostnameOrIp}) is not available`);

            return;
        }

        const maxAttempts = 3;
        let attempts = 0;

        let remoteServerInfo: Outline.Server | undefined;

        do {
            try {
                this.logger.info("Getting server info from remote server...");
                remoteServerInfo = await this.client.server();
            } catch (error) {
                this.logger.error(`Attempt #${attempts + 1} failed: ${error}\n`);
                attempts++;
            }
        } while (!remoteServerInfo && attempts < maxAttempts);

        if (remoteServerInfo) {
            this.logger.info("Getting server usage metrics...");
            const metrics = await this.client.metricsTransfer();

            await this.syncAccessKeys(metrics);
        }
    }

    protected async syncAccessKeys(metrics: Outline.Metrics): Promise<void> {
        this.logger.info("Loading servers access keys from local database...");
        const localAccessKeys = await prisma.accessKey.findMany({
            where: {
                serverId: this.server.id
            }
        });

        this.logger.info("Getting server access keys...");
        const remoteAccessKeys = await this.client.keys();

        for (const remoteAccessKey of remoteAccessKeys) {
            this.logger.info(`{${remoteAccessKey.name} (${remoteAccessKey.id})}`);
            const localAccessKey = localAccessKeys.find(
                (localAccessKey) => localAccessKey.apiId === remoteAccessKey.id
            );

            const dataLimit = this.bytesToMb(remoteAccessKey.dataLimitInBytes);

            if (localAccessKey) {
                // this means we need to update the access key
                this.logger.info(`Updating access key info in local database...`);

                let accessKeyName = remoteAccessKey.name;

                if (accessKeyName.length === 0) {
                    accessKeyName = `Key #${remoteAccessKey.id}`;
                }
                await prisma.accessKey.update({
                    where: { id: localAccessKey.id },
                    data: {
                        name: accessKeyName,
                        dataLimit: dataLimit,
                        dataLimitUnit: DataLimitUnit.MB,
                        dataUsage: metrics.bytesTransferredByUserId[remoteAccessKey.id]
                    }
                });

                if (this.isAccessKeyExpired(localAccessKey)) {
                    this.logger.info("Disabling access key due to expiration date...");
                    await this.disableExpiredAccessKey(localAccessKey);
                }
            } else {
                // and this means we need to create the access key
                this.logger.info(`Creating missing access key in local database...`);

                await prisma.accessKey.create({
                    data: {
                        serverId: this.server.id,
                        name: remoteAccessKey.name,
                        prefix: null,
                        expiresAt: null,
                        dataLimit: this.bytesToMb(metrics.bytesTransferredByUserId[remoteAccessKey.id])!,
                        dataLimitUnit: DataLimitUnit.MB,
                        apiId: remoteAccessKey.id,
                        accessUrl: remoteAccessKey.accessUrl,
                        method: remoteAccessKey.method,
                        password: remoteAccessKey.password,
                        port: remoteAccessKey.port
                    }
                });
            }
        }

        this.logger.info("Removing access keys that does not exist in remote server...");

        const localAccessKeysToRemove = [];

        for (const localAccessKey of localAccessKeys) {
            if (remoteAccessKeys.find((remoteAccessKey) => remoteAccessKey.id === localAccessKey.apiId)) {
                continue;
            }

            this.logger.info(`{${localAccessKey.name} (${localAccessKey.apiId})}`);
            localAccessKeysToRemove.push(localAccessKey.id);
        }

        if (localAccessKeysToRemove.length > 0) {
            this.logger.info("Removing access keys from local database...", localAccessKeysToRemove);

            await prisma.accessKey.deleteMany({
                where: {
                    id: {
                        in: localAccessKeysToRemove
                    }
                }
            });
        } else {
            this.logger.info("There is no access key to remove");
        }
    }

    protected isAccessKeyExpired(accessKey: AccessKey): boolean {
        if (!accessKey.expiresAt) {
            return false;
        }

        this.logger.info("Checking for access key expiration date...");

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
            this.logger.error(`Attempt to disabling access key failed: ${error}\n`);
        }
    }

    protected bytesToMb(value?: number | null): number | null {
        if (!value) return null;

        return Math.round(value / BYTES_TO_MB_RATE);
    }
}

import prisma from "@/prisma/db";
import ApiClient from "@/core/outline/api-client";
import { AccessKey, Server } from "@prisma/client";
import { DataLimitUnit, Outline } from "@/core/definitions";
import { convertDataLimitToUnit } from "@/core/utils";

const DISABLED_ACCESS_KEY_LIMIT_IN_BYTES = 1000;

const syncServer = async (outlineClient: ApiClient, server: Server): Promise<void> => {
    const maxAttempts = 3;
    let attempts = 0;

    let remoteServerInfo: Outline.Server | undefined;

    do {
        try {
            console.log("Getting server info from remote server...");
            remoteServerInfo = await outlineClient.server();
        } catch (error) {
            console.error(`Attempt #${attempts + 1} failed: ${error}\n`);
            attempts++;
        }
    } while (!remoteServerInfo && attempts < maxAttempts);

    if (remoteServerInfo) {
        console.log("Getting server usage metrics...");
        const metrics = await outlineClient.metricsTransfer();

        const allMetrics = Object.values(metrics.bytesTransferredByUserId);
        const totalUsageMetrics = allMetrics.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

        console.log("Updating server info in local database...");
        await prisma.server.update({
            where: { id: server.id },
            data: {
                name: remoteServerInfo.name,
                hostnameForNewAccessKeys: remoteServerInfo.hostnameForAccessKeys,
                portForNewAccessKeys: remoteServerInfo.portForNewAccessKeys,
                isMetricsEnabled: remoteServerInfo.metricsEnabled,
                totalDataUsage: totalUsageMetrics,
                isAvailable: true
            }
        });

        await syncAccessKeys(outlineClient, metrics, server.id);
    } else {
        console.log("Changing server status to unavailable...");
        await prisma.server.update({
            where: { id: server.id },
            data: {
                isAvailable: false
            }
        });
    }
};

const syncAccessKeys = async (outlineClient: ApiClient, metrics: Outline.Metrics, serverId: number): Promise<void> => {
    console.log("\nLoading servers access keys from local database...");
    const localAccessKeys = await prisma.accessKey.findMany({
        where: {
            serverId
        }
    });

    console.log("Getting server access keys...");
    const remoteAccessKeys = await outlineClient.keys();

    for (const remoteAccessKey of remoteAccessKeys) {
        console.log(`\n----->{${remoteAccessKey.name} (${remoteAccessKey.id})}`);
        const localAccessKey = localAccessKeys.find((localAccessKey) => localAccessKey.apiId === remoteAccessKey.id);

        const dataLimitUnit = localAccessKey ? (localAccessKey.dataLimitUnit as DataLimitUnit) : DataLimitUnit.Bytes;

        const dataLimit = remoteAccessKey.dataLimitInBytes
            ? convertDataLimitToUnit(remoteAccessKey.dataLimitInBytes, dataLimitUnit)
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

            if (isAccessKeyExpired(localAccessKey)) {
                console.log("Disabling access key due to expiration date...");
                await disableExpiredAccessKey(outlineClient, localAccessKey);
            }
        } else {
            // and this means we need to create the access key
            console.log(`Creating missing access key in local database...`);

            await prisma.accessKey.create({
                data: {
                    serverId: serverId,
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
};

const isAccessKeyExpired = (accessKey: AccessKey) => {
    if (!accessKey.expiresAt) {
        return false;
    }

    console.log("Checking for access key expiration date...");
    return accessKey.expiresAt <= new Date();
};

const disableExpiredAccessKey = async (outlineClient: ApiClient, accessKey: AccessKey) => {
    try {
        await outlineClient.removeDataLimitForKey(accessKey.apiId);
        await outlineClient.setDataLimitForKey(accessKey.apiId, DISABLED_ACCESS_KEY_LIMIT_IN_BYTES);

        await prisma.accessKey.update({
            where: { id: accessKey.id },
            data: {
                dataLimit: DISABLED_ACCESS_KEY_LIMIT_IN_BYTES,
                dataLimitUnit: DataLimitUnit.Bytes
            }
        });
    } catch (error) {
        console.error(`Attempt to disabling access key failed: ${error}\n`);
    }
};

const main = async () => {
    console.log("Loading servers from local database...");
    const servers = await prisma.server.findMany();

    console.log("Syncing started...");
    for (const server of servers) {
        console.log(`\n=====>{${server.name} - ${server.apiId}}`);

        const outlineClient = ApiClient.fromConfig(server.managementJson);

        await syncServer(outlineClient, server);
    }
};

main()
    .then(() => {
        console.log("\n");
        console.log("══════════════════════════════════════════════════");
        console.log("   Outline Sync Script Executed Successfully 😎   ");
        console.log("══════════════════════════════════════════════════");
    })
    .catch((error) => {
        console.log("\n");
        console.log("════════════════════════════════════════════════");
        console.log("   Outline Sync Script Failed Successfully 🥺   ");
        console.log("════════════════════════════════════════════════");
        console.log("\n");
        console.error(error);
    });

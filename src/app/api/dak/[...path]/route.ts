// TODO: Refactor this hell

import { NextResponse } from "next/server";
import { AccessKey, DynamicAccessKey, Server } from "@prisma/client";

import { getDynamicAccessKeyByPath } from "@/src/core/actions/dynamic-access-key";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";
import prisma from "@/prisma/db";
import {
    DataLimitUnit,
    DynamicAccessKeyApiResponse,
    DynamicAccessKeyWithAccessKeys,
    LoadBalancerAlgorithm
} from "@/src/core/definitions";
import { crc32, getDakExpiryDateBasedOnValidityPeriod } from "@/src/core/utils";
import { createAccessKey } from "@/src/core/actions/access-key";

interface ContextProps {
    params: {
        path: string[];
    };
}

export async function GET(req: Request, context: ContextProps) {
    const path = context.params.path.join("/");

    const dynamicAccessKey = await getDynamicAccessKeyByPath(path);

    if (!dynamicAccessKey) {
        return jsonError("There is no dynamic access key with this path");
    }

    if (dynamicAccessKey.expiresAt && dynamicAccessKey.expiresAt <= new Date()) {
        return jsonError("The dynamic access key has expired");
    }

    const expiryDate = getDakExpiryDateBasedOnValidityPeriod(dynamicAccessKey);

    if (expiryDate && expiryDate <= new Date()) {
        return jsonError("The dynamic access key has expired");
    }

    if (dynamicAccessKey.isSelfManaged) {
        return await handleSelfManagedDynamicAccessKey(dynamicAccessKey);
    }

    if (dynamicAccessKey.accessKeys.length === 0) {
        return jsonError("There is no associated access key to this dynamic access key");
    }

    const clientIp = (
        req.headers.get("x-forwarded-for") ??
        req.headers.get("x-real-ip") ??
        req.headers.get("x-client-ip") ??
        "127.0.0.1"
    ).split(",")[0];

    const selectedAccessKey = await selectAccessKey(dynamicAccessKey, clientIp);
    const selectedServer = await prisma.server.findFirstOrThrow({
        where: { id: selectedAccessKey.serverId }
    });

    return await createAccessKeyResponse(dynamicAccessKey, selectedServer, selectedAccessKey);
}

const selectAccessKey = async (
    dynamicAccessKey: DynamicAccessKeyWithAccessKeys,
    clientIp: string
): Promise<AccessKey> => {
    const accessKeys = dynamicAccessKey.accessKeys;

    switch (dynamicAccessKey.loadBalancerAlgorithm) {
        case LoadBalancerAlgorithm.UserIpAddress:
            return selectAccessKeyByClientIp(accessKeys, clientIp);

        case LoadBalancerAlgorithm.RandomServerKeyOnEachConnection:
            return selectRandomServerKey(accessKeys);

        case LoadBalancerAlgorithm.RandomKeyOnEachConnection:
        default:
            return accessKeys[Math.floor(Math.random() * accessKeys.length)];
    }
};

const selectAccessKeyByClientIp = (accessKeys: AccessKey[], clientIp: string) => {
    const hash = crc32(clientIp);
    const index = hash % accessKeys.length;

    return accessKeys[index];
};

const selectRandomServerKey = (accessKeys: AccessKey[]) => {
    // Group keys by serverId
    const uniqueServers: Map<number, AccessKey[]> = accessKeys.reduce((map, key) => {
        const serverId = key.serverId;

        if (!map.has(serverId)) {
            map.set(serverId, []);
        }
        map.get(serverId)!.push(key);

        return map;
    }, new Map<number, AccessKey[]>());

    // Select a random group (server)
    const serverGroups = Array.from(uniqueServers.values());
    const selectedServer = serverGroups[Math.floor(Math.random() * serverGroups.length)];

    // Select a random key from the selected server
    return selectedServer[Math.floor(Math.random() * selectedServer.length)];
};

export const handleSelfManagedDynamicAccessKey = async (dynamicAccessKey: DynamicAccessKeyWithAccessKeys) => {
    const bytesPerMB = 1024 * 1024;
    const dataLimitInBytes = Number(dynamicAccessKey.dataLimit) * bytesPerMB;

    if (dynamicAccessKey.dataUsage >= dataLimitInBytes) {
        return jsonError("The dynamic access key data usage limit exceeded");
    }

    const accessKeyName = `self-managed-dak-access-key-${dynamicAccessKey.id}`;

    try {
        const servers = await getAvailableServers(dynamicAccessKey);

        if (servers.length === 0) {
            return jsonError("Server pool is empty");
        }

        let activeServerId = await validateOrSelectServer(dynamicAccessKey, servers);

        if (!activeServerId) {
            return jsonError("No active server could be selected");
        }

        return await getOrCreateAccessKeyResponse(dynamicAccessKey, accessKeyName, activeServerId);
    } catch (error) {
        console.error("handleSelfManagedDynamicAccessKey error:", error);

        return jsonError("The dynamic access key configuration is incorrect");
    }
};

async function getAvailableServers(dynamicAccessKey: DynamicAccessKeyWithAccessKeys): Promise<Server[]> {
    const poolItems = JSON.parse(dynamicAccessKey.serverPoolValue ?? "[]");

    switch (dynamicAccessKey.serverPoolType) {
        case "manual":
            return prisma.server.findMany({
                where: {
                    id: { in: poolItems },
                    isAvailable: true
                }
            });

        case "tag":
            return prisma.server.findMany({
                where: {
                    isAvailable: true,
                    tags: {
                        some: {
                            tagId: { in: poolItems }
                        }
                    }
                }
            });

        default:
            return [];
    }
}

async function validateOrSelectServer(
    dynamicAccessKey: DynamicAccessKeyWithAccessKeys,
    servers: Server[]
): Promise<number | null> {
    const activeServerId = dynamicAccessKey.activeServerId;

    if (activeServerId) {
        const isStillAvailable = servers.some((s) => s.id === activeServerId && s.isAvailable);

        if (isStillAvailable) {
            return activeServerId;
        }
        console.warn(`Active server ${activeServerId} is no longer available. Selecting a new one.`);
    }

    const newServerId = await setRandomActiveServer(dynamicAccessKey, servers);

    return newServerId ?? null;
}

async function setRandomActiveServer(
    dynamicAccessKey: DynamicAccessKeyWithAccessKeys,
    servers: Server[]
): Promise<number> {
    const randomServer = servers[Math.floor(Math.random() * servers.length)];

    await prisma.dynamicAccessKey.update({
        where: { id: dynamicAccessKey.id },
        data: { activeServerId: randomServer.id }
    });

    return randomServer.id;
}

async function getOrCreateAccessKeyResponse(
    dynamicAccessKey: DynamicAccessKeyWithAccessKeys,
    accessKeyName: string,
    activeServerId: number
) {
    const activeServer = await prisma.server.findUnique({
        where: { id: activeServerId, isAvailable: true },
        include: { accessKeys: true }
    });

    if (!activeServer) {
        return jsonError("Could not find active server");
    }

    let accessKey = activeServer.accessKeys.find((k) => k.name === accessKeyName);

    if (!accessKey) {
        accessKey = await createAccessKey({
            serverId: activeServer.id,
            name: accessKeyName,
            prefix: null,
            expiresAt: null,
            dataLimit: null,
            dataLimitUnit: DataLimitUnit.MB
        });
    }

    return await createAccessKeyResponse(dynamicAccessKey, activeServer, accessKey);
}

function jsonError(message: string) {
    return NextResponse.json({ error: { message } });
}

const createAccessKeyResponse = async (
    dynamicAccessKey: DynamicAccessKey,
    selectedServer: Server,
    selectedAccessKey: AccessKey
) => {
    if (!dynamicAccessKey.usageStartedAt) {
        await prisma.dynamicAccessKey.update({
            where: { id: dynamicAccessKey.id },
            data: { usageStartedAt: new Date() }
        });
    }

    const result: DynamicAccessKeyApiResponse = {
        server: selectedServer.hostnameOrIp,
        server_port: selectedAccessKey.port,
        password: selectedAccessKey.password,
        method: selectedAccessKey.method
    };

    if (dynamicAccessKey.prefix) {
        const prefix = AccessKeyPrefixes.find((x) => x.type === dynamicAccessKey.prefix);

        if (prefix) {
            return NextResponse.json({ ...result, prefix: prefix.jsonEncodedValue });
        }
    }

    return NextResponse.json(result);
};

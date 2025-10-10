import { NextResponse } from "next/server";
import { AccessKey } from "@prisma/client";

import { getDynamicAccessKeyByPath } from "@/src/core/actions/dynamic-access-key";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";
import prisma from "@/prisma/db";
import {
    DynamicAccessKeyApiResponse,
    DynamicAccessKeyWithAccessKeys,
    LoadBalancerAlgorithm
} from "@/src/core/definitions";
import { crc32 } from "@/src/core/utils";

interface ContextProps {
    params: {
        path: string[];
    };
}

export async function GET(req: Request, context: ContextProps) {
    const path = context.params.path.join("/");

    const dynamicAccessKey = await getDynamicAccessKeyByPath(path, true);

    if (!dynamicAccessKey) {
        return NextResponse.json({
            error: {
                message: "There is no dynamic access key with this path"
            }
        });
    }

    if (dynamicAccessKey.expiresAt && dynamicAccessKey.expiresAt <= new Date()) {
        return NextResponse.json({
            error: {
                message: "The dynamic access key has expired"
            }
        });
    }

    if (dynamicAccessKey.accessKeys.length === 0) {
        return NextResponse.json({
            error: {
                message: "There is no associated access key to this dynamic access key"
            }
        });
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

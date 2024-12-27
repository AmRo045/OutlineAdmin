"use server";

import { revalidatePath } from "next/cache";
import { Server } from "@prisma/client";
import { notFound } from "next/navigation";

import prisma from "@/prisma/db";
import { EditServerRequest, NewServerRequest, ServerWithAccessKeysCount } from "@/core/definitions";
import ApiClient from "@/core/outline/api-client";

export async function getServers(
    filters?: { term?: string; skip?: number; take?: number },
    withKeysCount: boolean = false
): Promise<ServerWithAccessKeysCount[]> {
    const { term, skip = 0, take = 10 } = filters || {};

    return prisma.server.findMany({
        where: {
            OR: term ? [{ hostnameOrIp: { contains: term } }, { name: { contains: term } }] : undefined
        },
        skip,
        take,
        orderBy: [{ id: "desc" }],
        include: {
            _count: withKeysCount ? { select: { accessKeys: true } } : undefined
        }
    });
}

export async function getServerById(id: number, withKeys: boolean = false): Promise<Server | null> {
    return prisma.server.findFirst({
        where: {
            id
        },
        include: {
            accessKeys: withKeys
        }
    });
}

export async function updateMetrics(id: number): Promise<void> {
    const server = await getServerById(id);

    if (!server) {
        return;
    }

    const outlineClient = ApiClient.fromConfig(server.managementJson);
    const metrics = await outlineClient.metricsTransfer();

    let sum = 0;

    Object.entries(metrics.bytesTransferredByUserId).forEach(([id, value]: [string, number]) => {
        prisma.accessKey.update({
            // @ts-ignore
            where: { apiId: id },
            data: { dataUsage: value }
        });

        sum += value;
    });

    await prisma.server.update({
        where: { id: server.id },
        data: {
            totalDataUsage: sum
        }
    });
}

export async function createServer(data: NewServerRequest): Promise<void> {
    const outlineClient = ApiClient.fromConfig(data.managementJson);
    const outlineServer = await outlineClient.server();

    await prisma.server.create({
        data: {
            managementJson: data.managementJson,
            apiUrl: outlineClient.apiUrl,
            apiCertSha256: outlineClient.certSha256,
            apiId: outlineServer.serverId,
            name: outlineServer.name,
            version: outlineServer.version,
            hostnameOrIp: outlineServer.hostnameForAccessKeys,
            hostnameForNewAccessKeys: outlineServer.hostnameForAccessKeys,
            portForNewAccessKeys: outlineServer.portForNewAccessKeys,
            isMetricsEnabled: outlineServer.metricsEnabled,
            isAvailable: true,
            apiCreatedAt: new Date(outlineServer.createdTimestampMs)
        }
    });

    revalidatePath("/servers");
}

export async function updateServer(id: number, data: EditServerRequest): Promise<void> {
    const server = await getServerById(id);

    if (!server) {
        notFound();
    }

    const outlineClient = ApiClient.fromConfig(server.managementJson);

    await outlineClient.setServerName(data.name);
    await outlineClient.setHostNameForNewKeys(data.hostnameForNewAccessKeys);
    await outlineClient.setPortForNewKeys(data.portForNewAccessKeys);

    await prisma.server.update({
        where: { id },
        data: {
            name: data.name,
            hostnameForNewAccessKeys: data.hostnameForNewAccessKeys,
            portForNewAccessKeys: data.portForNewAccessKeys
        }
    });

    revalidatePath("/servers");
}

export async function removeServer(id: number): Promise<void> {
    await prisma.server.delete({
        where: {
            id: id
        }
    });

    revalidatePath("/servers");
}

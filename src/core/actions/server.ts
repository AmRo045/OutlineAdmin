"use server";

import { revalidatePath } from "next/cache";
import { Server } from "@prisma/client";
import { notFound } from "next/navigation";

import prisma from "@/prisma/db";
import {
    EditServerRequest,
    NewServerRequest,
    ServerWithAccessKeys,
    ServerWithAccessKeysAndTags,
    ServerWithAccessKeysCount,
    ServerWithAccessKeysCountAndTags,
    ServerWithTags
} from "@/src/core/definitions";
import OutlineClient from "@/src/core/outline/outline-client";
import { OutlineSyncService } from "@/src/core/outline/outline-sync-service";

export async function getServers(
    filters?: { term?: string },
    withKeysCount: boolean = false
): Promise<ServerWithAccessKeysCount[]> {
    const { term } = filters || {};

    return prisma.server.findMany({
        where: {
            OR: term ? [{ hostnameOrIp: { contains: term } }, { name: { contains: term } }] : undefined
        },
        orderBy: [{ id: "desc" }],
        include: {
            _count: withKeysCount ? { select: { accessKeys: true } } : undefined
        }
    });
}

export async function getServersWithTags(
    filters?: { term?: string },
    withKeysCount: boolean = false
): Promise<ServerWithAccessKeysCountAndTags[]> {
    const { term } = filters || {};

    return prisma.server.findMany({
        where: {
            OR: term
                ? [
                      { hostnameOrIp: { contains: term } },
                      { name: { contains: term } },
                      {
                          tags: {
                              some: {
                                  tag: {
                                      name: { contains: term }
                                  }
                              }
                          }
                      }
                  ]
                : undefined
        },
        orderBy: [{ id: "desc" }],
        include: {
            _count: withKeysCount ? { select: { accessKeys: true } } : undefined,
            tags: { include: { tag: true } }
        }
    });
}

export async function getServersWithAccessKeys(filters?: {
    term?: string;
    skip?: number;
    take?: number;
}): Promise<ServerWithAccessKeys[]> {
    const { term, skip = 0, take = 10 } = filters || {};

    return prisma.server.findMany({
        where: {
            OR: term ? [{ hostnameOrIp: { contains: term } }, { name: { contains: term } }] : undefined
        },
        skip,
        take,
        orderBy: [{ id: "desc" }],
        include: {
            accessKeys: true
        }
    });
}

export async function getServersWithAccessKeysAndTags(filters?: {
    term?: string;
    skip?: number;
    take?: number;
}): Promise<ServerWithAccessKeysAndTags[]> {
    const { term, skip = 0, take = 10 } = filters || {};

    return prisma.server.findMany({
        where: {
            OR: term ? [{ hostnameOrIp: { contains: term } }, { name: { contains: term } }] : undefined
        },
        skip,
        take,
        orderBy: [{ id: "desc" }],
        include: {
            accessKeys: true,
            tags: {
                include: {
                    tag: true
                }
            }
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

export async function getServerByIdWithTags(id: number): Promise<ServerWithTags | null> {
    return prisma.server.findFirst({
        where: {
            id
        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });
}

export async function createServer(data: NewServerRequest): Promise<void> {
    const outlineClient = OutlineClient.fromConfig(data.managementJson);
    const outlineServer = await outlineClient.server();

    const server = await prisma.server.create({
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

    await syncServer(server);

    revalidatePath("/servers");
}

export async function updateServer(id: number, data: EditServerRequest): Promise<void> {
    const server = await getServerById(id);

    if (!server) {
        notFound();
    }

    const outlineClient = OutlineClient.fromConfig(server.managementJson);

    await outlineClient.setServerName(data.name);
    await outlineClient.setHostNameForNewKeys(data.hostnameForNewAccessKeys);
    await outlineClient.setPortForNewKeys(data.portForNewAccessKeys);

    const tagIds = data.tags?.map((t) => Number(t)) ?? [];

    await prisma.server.update({
        where: { id },
        data: {
            name: data.name,
            hostnameForNewAccessKeys: data.hostnameForNewAccessKeys,
            portForNewAccessKeys: data.portForNewAccessKeys,

            tags: {
                deleteMany: {},
                create: tagIds.map((tagId) => ({ tagId }))
            }
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

export async function syncServer(server: number | Server): Promise<void> {
    let serverToSync: Server | null;

    if (typeof server === "number") {
        serverToSync = await getServerById(server);
    } else {
        serverToSync = server;
    }

    if (!serverToSync) {
        return;
    }

    const syncService = new OutlineSyncService(serverToSync);

    await syncService.sync();

    revalidatePath("/servers");
    revalidatePath(`/servers/${serverToSync.id}/access-keys`);
}

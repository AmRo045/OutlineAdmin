"use server";

import { revalidatePath } from "next/cache";
import { AccessKey } from "@prisma/client";

import prisma from "@/prisma/db";
import { EditAccessKeyRequest, NewAccessKeyRequest } from "@/src/core/definitions";
import OutlineClient from "@/src/core/outline/outline-client";
import { BYTES_TO_MB_RATE, PAGE_SIZE } from "@/src/core/config";

export async function getAccessKeys(
    serverId: number,
    filters?: { skip?: number; take?: number }
): Promise<AccessKey[]> {
    const { skip = 0, take = PAGE_SIZE } = filters || {};

    return prisma.accessKey.findMany({
        where: {
            serverId
        },
        skip,
        take,
        orderBy: [{ id: "desc" }]
    });
}

export async function getAccessKeysCount(serverId: number): Promise<number> {
    return prisma.accessKey.count({
        where: {
            serverId
        },
        orderBy: [{ id: "desc" }]
    });
}

export async function getAccessKeyById(serverId: number, id: number): Promise<AccessKey | null> {
    return prisma.accessKey.findFirst({
        where: {
            serverId,
            id
        }
    });
}

export async function createAccessKey(data: NewAccessKeyRequest): Promise<AccessKey> {
    const server = await prisma.server.findFirstOrThrow({
        where: { id: data.serverId }
    });

    const outlineClient = OutlineClient.fromConfig(server.managementJson);

    const newAccessKey = await outlineClient.createKey();

    await outlineClient.renameKey(newAccessKey.id, data.name);

    if (data.dataLimit) {
        await outlineClient.setDataLimitForKey(newAccessKey.id, Number(data.dataLimit) * BYTES_TO_MB_RATE);
    }

    const createdAccessKey = await prisma.accessKey.create({
        data: {
            serverId: data.serverId,
            name: data.name,
            prefix: data.prefix,
            expiresAt: data.expiresAt,
            dataLimit: Number(data.dataLimit) ?? 0,
            dataLimitUnit: data.dataLimitUnit,
            apiId: newAccessKey.id,
            accessUrl: newAccessKey.accessUrl,
            method: newAccessKey.method,
            password: newAccessKey.password,
            port: newAccessKey.port
        }
    });

    revalidatePath("/servers");
    revalidatePath(`/servers/${data.serverId}/access-keys`);

    return createdAccessKey;
}

export async function updateAccessKey(data: EditAccessKeyRequest): Promise<void> {
    const server = await prisma.server.findFirstOrThrow({
        where: { id: data.serverId }
    });

    const outlineClient = OutlineClient.fromConfig(server.managementJson);

    const accessKey = await prisma.accessKey.findFirstOrThrow({
        where: {
            id: data.id
        }
    });

    await outlineClient.renameKey(accessKey.apiId, data.name);

    if (data.dataLimit) {
        await outlineClient.setDataLimitForKey(accessKey.apiId, Number(data.dataLimit) * BYTES_TO_MB_RATE);
    } else {
        await outlineClient.removeDataLimitForKey(accessKey.apiId);
    }

    await prisma.accessKey.update({
        where: {
            id: data.id
        },
        data: {
            name: data.name,
            expiresAt: data.expiresAt,
            prefix: data.prefix,
            dataLimit: Number(data.dataLimit) ?? 0,
            dataLimitUnit: data.dataLimitUnit
        }
    });

    revalidatePath("/servers");
    revalidatePath(`/servers/${data.serverId}/access-keys`);
}

export async function removeAccessKey(
    serverId: number,
    id: number,
    apiId?: string,
    revalidateUiPath: boolean = true
): Promise<void> {
    const server = await prisma.server.findFirstOrThrow({
        where: { id: serverId }
    });

    const outlineClient = OutlineClient.fromConfig(server.managementJson);

    if (apiId) {
        await outlineClient.deleteKey(apiId);
    } else {
        const accessKey = await prisma.accessKey.findFirstOrThrow({
            where: {
                id: id
            }
        });

        await outlineClient.deleteKey(accessKey.apiId);
    }

    await prisma.accessKey.delete({
        where: {
            id: id
        }
    });

    if (revalidateUiPath) {
        revalidatePath("/servers");
        revalidatePath(`/servers/${serverId}/access-keys`);
    }
}

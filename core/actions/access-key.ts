"use server";

import { revalidatePath } from "next/cache";
import { AccessKey } from "@prisma/client";

import prisma from "@/prisma/db";
import { EditAccessKeyRequest, NewAccessKeyRequest } from "@/core/definitions";
import ApiClient from "@/core/outline/api-client";
import { convertDataLimitToBytes } from "@/core/utils";

export async function getAccessKeys(
    serverId: number,
    filters?: { skip?: number; take?: number }
): Promise<AccessKey[]> {
    const { skip = 0, take = 10 } = filters || {};

    return prisma.accessKey.findMany({
        where: {
            serverId
        },
        skip,
        take,
        orderBy: [{ id: "desc" }]
    });
}

export async function createAccessKey(data: NewAccessKeyRequest): Promise<void> {
    const server = await prisma.server.findFirstOrThrow({
        where: { id: data.serverId }
    });

    const outlineClient = ApiClient.fromConfig(server.managementJson);

    const newAccessKey = await outlineClient.createKey();

    await outlineClient.renameKey(newAccessKey.id, data.name);

    if (data.dataLimit) {
        await outlineClient.setDataLimitForKey(
            newAccessKey.id,
            convertDataLimitToBytes(Number(data.dataLimit), data.dataLimitUnit)
        );
    }

    await prisma.accessKey.create({
        data: {
            serverId: data.serverId,
            name: data.name,
            prefix: data.prefix,
            expiresAt: data.expiresAt,
            dataLimit: Number(data.dataLimit),
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
}

export async function updateAccessKey(data: EditAccessKeyRequest): Promise<void> {
    await prisma.accessKey.update({
        where: {
            id: data.id
        },
        data: {
            name: data.name,
            expiresAt: data.expiresAt,
            prefix: data.prefix,
            dataLimit: Number(data.dataLimit),
            dataLimitUnit: data.dataLimitUnit
        }
    });

    revalidatePath("/servers");
    revalidatePath(`/servers/${data.serverId}/access-keys`);
}

export async function removeAccessKey(serverId: number, id: number): Promise<void> {
    await prisma.accessKey.delete({
        where: {
            id: id
        }
    });

    revalidatePath("/servers");
    revalidatePath(`/servers/${serverId}/access-keys`);
}

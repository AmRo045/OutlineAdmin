"use server";

import { revalidatePath } from "next/cache";
import { DynamicAccessKey } from "@prisma/client";

import prisma from "@/prisma/db";
import {
    DynamicAccessKeyWithAccessKeys,
    DynamicAccessKeyWithAccessKeysCount,
    EditDynamicAccessKeyRequest,
    NewDynamicAccessKeyRequest
} from "@/src/core/definitions";
import { PAGE_SIZE } from "@/src/core/config";

export async function getDynamicAccessKeys(
    filters?: { term?: string; skip?: number; take?: number },
    withKeysCount: boolean = false
): Promise<DynamicAccessKeyWithAccessKeysCount[]> {
    const { skip = 0, take = PAGE_SIZE, term } = filters || {};

    return prisma.dynamicAccessKey.findMany({
        where: {
            OR: term ? [{ name: { contains: term } }] : undefined
        },
        skip,
        take,
        orderBy: [{ id: "desc" }],
        include: {
            _count: withKeysCount ? { select: { accessKeys: true } } : undefined
        }
    });
}

export async function getDynamicAccessKeysCount(filters?: { term?: string }): Promise<number> {
    const { term } = filters || {};

    return prisma.dynamicAccessKey.count({
        where: {
            OR: term ? [{ name: { contains: term } }] : undefined
        },
        orderBy: [{ id: "desc" }]
    });
}

export async function getDynamicAccessKeyById(
    id: number,
    withKeys: boolean = false
): Promise<DynamicAccessKeyWithAccessKeys | null> {
    return prisma.dynamicAccessKey.findFirst({
        where: {
            id
        },
        include: {
            accessKeys: withKeys
        }
    });
}

export async function findDynamicAccessKeyById(id: number): Promise<DynamicAccessKey | null> {
    return prisma.dynamicAccessKey.findFirst({
        where: {
            id
        }
    });
}

export async function getDynamicAccessKeyByPath(path: string): Promise<DynamicAccessKeyWithAccessKeys | null> {
    return prisma.dynamicAccessKey.findFirst({
        where: {
            path
        },
        include: {
            accessKeys: {
                where: {
                    server: {
                        isAvailable: true
                    }
                }
            }
        }
    });
}

export async function syncDynamicAccessKeyAccessKeys(
    dynamicAccessKeyId: number,
    accessKeyIds: number[]
): Promise<void> {
    await prisma.dynamicAccessKey.update({
        where: { id: dynamicAccessKeyId },
        data: {
            accessKeys: {
                set: accessKeyIds.map((id) => ({ id }))
            }
        }
    });

    revalidatePath("/dynamic-access-keys");
}

export async function createDynamicAccessKey(data: NewDynamicAccessKeyRequest): Promise<void> {
    await prisma.dynamicAccessKey.create({
        data: {
            name: data.name,
            path: data.path,
            loadBalancerAlgorithm: data.loadBalancerAlgorithm,
            prefix: data.prefix,
            expiresAt: data.expiresAt
        }
    });

    revalidatePath("/dynamic-access-keys");
}

export async function updateDynamicAccessKey(data: EditDynamicAccessKeyRequest): Promise<void> {
    await prisma.dynamicAccessKey.update({
        where: { id: data.id },
        data: {
            name: data.name,
            path: data.path,
            loadBalancerAlgorithm: data.loadBalancerAlgorithm,
            prefix: data.prefix,
            expiresAt: data.expiresAt
        }
    });

    revalidatePath("/dynamic-access-keys");
}

export async function removeDynamicAccessKey(id: number): Promise<void> {
    await prisma.dynamicAccessKey.delete({
        where: {
            id: id
        }
    });

    revalidatePath("/dynamic-access-keys");
}

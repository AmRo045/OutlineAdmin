"use server";

import { revalidatePath } from "next/cache";
import { Server } from "@prisma/client";

import prisma from "@/prisma/db";
import { EditServerRequest, NewServerRequest } from "@/core/definitions";

export async function getServers(filters?: { term?: string; skip?: number; take?: number }): Promise<Server[]> {
    const { term, skip = 0, take = 10 } = filters || {};

    return prisma.server.findMany({
        where: {
            OR: term ? [{ hostnameOrIp: { contains: term } }, { name: { contains: term } }] : undefined
        },
        skip,
        take,
        orderBy: [{ id: "desc" }]
    });
}

export async function getServerById(id: number): Promise<Server | null> {
    return prisma.server.findFirst({
        where: {
            id
        }
    });
}

export async function createServer(data: NewServerRequest): Promise<void> {
    await prisma.server.create({
        data
    });

    revalidatePath("/servers");
}

export async function updateServer(id: number, data: EditServerRequest): Promise<void> {
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

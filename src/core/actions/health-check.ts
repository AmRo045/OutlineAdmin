"use server";

import { revalidatePath } from "next/cache";
import { Telegraf } from "telegraf";

import prisma from "@/prisma/db";
import {
    HealthCheckTelegramNotificationConfig,
    HealthCheckWithServer,
    NewHealthCheckRequest,
    ServerWithHealthCheck,
    UpdateHealthCheckRequest
} from "@/src/core/definitions";

export async function createHealthCheck(data: NewHealthCheckRequest): Promise<void> {
    await prisma.healthCheck.create({ data });
    revalidatePath("/health-checks");
}

export async function getHealthChecks(filters?: {
    term?: string;
    skip?: number;
    take?: number;
}): Promise<HealthCheckWithServer[]> {
    const { term, skip = 0, take = 10 } = filters || {};

    return prisma.healthCheck.findMany({
        where: {
            server: term
                ? {
                      OR: [{ name: { contains: term } }, { hostnameOrIp: { contains: term } }]
                  }
                : undefined
        },
        skip,
        take,
        orderBy: { isAvailable: "desc" },
        include: {
            server: true
        }
    });
}

export async function getHealthChecksCount(filters?: { term?: string }): Promise<number> {
    const { term } = filters || {};

    if (term) {
        return prisma.healthCheck.count({
            where: {
                AND: [
                    {
                        server: {
                            OR: [{ name: { contains: term } }, { hostnameOrIp: { contains: term } }]
                        }
                    }
                ]
            }
        });
    }

    return prisma.healthCheck.count();
}

export async function getHealthCheckById(id: number) {
    return prisma.healthCheck.findUnique({
        where: { id },
        include: { server: true }
    });
}

export async function updateHealthCheck(data: UpdateHealthCheckRequest): Promise<void> {
    const { id, ...updateData } = data; // remove id

    await prisma.healthCheck.update({
        where: { id },
        data: updateData
    });

    revalidatePath("/health-checks");
    revalidatePath(`/health-checks/${id}`);
}

export async function deleteHealthCheck(id: number): Promise<void> {
    await prisma.healthCheck.delete({
        where: { id }
    });

    revalidatePath("/health-checks");
    revalidatePath(`/health-checks/${id}`);
}

export async function sendTelegramNotification(server: ServerWithHealthCheck): Promise<void> {
    const config = JSON.parse(server.healthCheck.notificationConfig ?? "{}") as HealthCheckTelegramNotificationConfig;

    const bot = new Telegraf(config.botToken);

    const userId = config.chatId;

    const message = config.messageTemplate
        .replaceAll("{{serverName}}", server.name)
        .replaceAll("{{serverHostnameOrIp}}", server.hostnameOrIp);

    await bot.telegram.sendMessage(userId, message);
}

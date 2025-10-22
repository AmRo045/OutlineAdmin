"use server";

import { revalidatePath } from "next/cache";
import { NotificationChannel } from "@prisma/client";
import { Telegraf } from "telegraf";

import prisma from "@/prisma/db";
import { ServerWithHealthCheck, TelegramNotificationChannelConfig } from "@/src/core/definitions";

export async function createNotificationChannel(data: any): Promise<void> {
    await prisma.notificationChannel.create({ data });

    revalidatePath("/health-checks/notification-channels");
}

export async function getNotificationChannels(filters?: {
    term?: string;
    skip?: number;
    take?: number;
}): Promise<NotificationChannel[]> {
    const { term, skip = 0, take = 10 } = filters || {};

    return prisma.notificationChannel.findMany({
        where: term ? { name: { contains: term } } : undefined,
        skip,
        take
    });
}

export async function getNotificationChannelsCount(filters?: { term?: string }): Promise<number> {
    const { term } = filters || {};

    if (term) {
        return prisma.notificationChannel.count({
            where: term ? { name: { contains: term } } : undefined
        });
    }

    return prisma.healthCheck.count();
}

export async function getNotificationChannelById(id: number) {
    return prisma.notificationChannel.findUnique({
        where: { id }
    });
}

export async function updateNotificationChannel(data: any): Promise<void> {
    const { id, ...updateData } = data; // remove id

    await prisma.notificationChannel.update({
        where: { id },
        data: updateData
    });

    revalidatePath("/health-checks/notification-channels");
    revalidatePath(`/health-checks/notification-channels/${id}`);
}

export async function deleteNotificationChannel(id: number): Promise<void> {
    await prisma.notificationChannel.delete({
        where: { id }
    });

    revalidatePath("/health-checks/notification-channels");
    revalidatePath(`/health-checks/notification-channels/${id}`);
}

export async function sendNotificationViaTelegramChannel(server: ServerWithHealthCheck): Promise<void> {
    const channel = await getNotificationChannelById(server.healthCheck.notificationChannelId!);

    if (!channel) {
        return;
    }

    const config = JSON.parse(channel.config ?? "{}") as TelegramNotificationChannelConfig;

    const bot = new Telegraf(config.botToken, {
        telegram: {
            apiRoot: config.apiUrl
        }
    });

    const userId = config.chatId;

    const message = config.messageTemplate
        .replaceAll("{{serverName}}", server.name)
        .replaceAll("{{serverHostnameOrIp}}", server.hostnameOrIp);

    await bot.telegram.sendMessage(userId, message);
}

export async function testTelegramNotificationChannel(
    config: TelegramNotificationChannelConfig
): Promise<{ ok: boolean; message: string }> {
    if (!config.apiUrl) {
        return {
            ok: false,
            message: "API URL is required"
        };
    }

    if (!config.botToken) {
        return {
            ok: false,
            message: "Bot token is required"
        };
    }

    if (!config.chatId) {
        return {
            ok: false,
            message: "Chat ID is required"
        };
    }

    if (!config.messageTemplate) {
        return {
            ok: false,
            message: "Message Template is required"
        };
    }

    try {
        const bot = new Telegraf(config.botToken, {
            telegram: {
                apiRoot: config.apiUrl
            }
        });

        const userId = config.chatId;

        const message = config.messageTemplate
            .replaceAll("{{serverName}}", "Example Server")
            .replaceAll("{{serverHostnameOrIp}}", "10.11.12.13");

        await bot.telegram.sendMessage(userId, message);

        return {
            ok: true,
            message: "Message sent!"
        };
    } catch (error) {
        return {
            ok: false,
            message: (error as object).toString()
        };
    }
}

import https from "https";
import crypto from "crypto";

import prisma from "@/prisma/db";
import { HEALTH_CHECK_DEFAULT_INTERVAL, HEALTH_CHECK_DEFAULT_NOTIFICATION_COOLDOWN } from "@/src/core/config";
import { createLogger } from "@/src/core/logger";
import { HealthCheckNotificationType, LoggerContext } from "@/src/core/definitions";
import { sendNotificationViaTelegramChannel } from "@/src/core/actions/notification-channel";

let logger = createLogger(LoggerContext.HealthCheckJob);

async function handleUnavailableServer(server: any, errorMessage: string) {
    const healthCheck = server.healthCheck;
    const now = new Date();

    logger.info(`[${server.name}] Marking as unavailable...`);

    await prisma.server.update({
        where: { id: server.id },
        data: { isAvailable: false, updatedAt: now }
    });

    await prisma.healthCheck.update({
        where: { serverId: server.id },
        data: { isAvailable: false, lastCheckedAt: now, updatedAt: now }
    });

    if (!healthCheck.notification) return;

    if (healthCheck.notificationSentAt) {
        const msSinceLastNotification = Date.now() - new Date(healthCheck.notificationSentAt).getTime();
        const cooldownMs = healthCheck.notificationCooldown * 60_000;

        if (msSinceLastNotification < cooldownMs) return;
    }

    if (healthCheck.notification === HealthCheckNotificationType.Telegram && server.healthCheck.notificationConfig) {
        try {
            logger.info("Sending Telegram notification...");
            await sendNotificationViaTelegramChannel(server, errorMessage);

            await prisma.healthCheck.update({
                where: { serverId: server.id },
                data: { notificationSentAt: now }
            });
        } catch (err) {
            logger.error("Failed to send Telegram notification:", err);
        }
    }
}

async function ensureHealthCheckExists(server: any) {
    if (server.healthCheck) return server.healthCheck;

    logger.info(`Creating health check for ${server.name}...`);

    return await prisma.healthCheck.create({
        data: {
            serverId: server.id,
            isAvailable: server.isAvailable,
            interval: HEALTH_CHECK_DEFAULT_INTERVAL,
            notificationCooldown: HEALTH_CHECK_DEFAULT_NOTIFICATION_COOLDOWN
        }
    });
}

function shouldSkipHealthCheck(healthCheck: any) {
    if (!healthCheck.lastCheckedAt) return false;

    const msSinceLastCheck = Date.now() - new Date(healthCheck.lastCheckedAt).getTime();
    const intervalMs = healthCheck.interval * 60_000;

    return msSinceLastCheck < intervalMs;
}

function createHttpsAgent(server: any) {
    return new https.Agent({
        rejectUnauthorized: true,
        checkServerIdentity: (host, cert) => {
            if (!server.apiCertSha256) return undefined;

            const sha256 = crypto.createHash("sha256").update(new Uint8Array(cert.raw)).digest("hex").toUpperCase();

            const expected = server.apiCertSha256.replace(/:/g, "").toUpperCase();

            if (sha256 !== expected) {
                throw new Error(`Certificate mismatch for ${host}\nExpected: ${expected}\nGot:      ${sha256}`);
            }

            return undefined;
        }
    });
}

async function checkServerHealth(server: any) {
    const url = `${server.apiUrl}/server`;
    const agent = createHttpsAgent(server);

    logger.info(`Checking ${server.name} (${url})...`);
    const start = performance.now();

    try {
        const response = await fetch(url, { agent } as any);
        const duration = performance.now() - start;
        const now = new Date();

        if (!response.ok) {
            logger.error(`[${server.name}] HTTP ${response.status} - ${response.statusText}`);

            const errorText = await response.text();
            const errorMessage = JSON.stringify({
                status: response.status,
                message: errorText
            });

            return await handleUnavailableServer(server, errorMessage);
        }

        logger.info(`[${server.name}] Healthy (${response.status}) — ${duration.toFixed(0)}ms`);

        // Update DB only if something changed
        if (!server.isAvailable || !server.healthCheck.isAvailable) {
            await prisma.server.update({
                where: { id: server.id },
                data: { isAvailable: true, updatedAt: now }
            });
        }

        await prisma.healthCheck.update({
            where: { serverId: server.id },
            data: {
                isAvailable: true,
                lastCheckedAt: now,
                updatedAt: now
            }
        });
    } catch (error: any) {
        logger.error(`[${server.name}] Error:`, error.message);
        await handleUnavailableServer(server, error.message);
    }
}

async function main() {
    logger.info("Loading servers from local database...");
    const servers = await prisma.server.findMany({ include: { healthCheck: true } });

    logger.info("Starting health checks...");

    for (const server of servers) {
        logger.info(`{ ${server.name} - ${server.hostnameOrIp} }`);

        server.healthCheck = await ensureHealthCheckExists(server);

        if (shouldSkipHealthCheck(server.healthCheck)) {
            logger.warn(`Skipping — checked recently (interval ${server.healthCheck!.interval}m)`);
            continue;
        }

        await checkServerHealth(server);
    }
}

main()
    .then(() => {
        logger.info("Health Check Script Executed Successfully 😎");
    })
    .catch((error) => {
        logger.info("Health Check Script Failed 🥺");
        logger.error(error);
    });

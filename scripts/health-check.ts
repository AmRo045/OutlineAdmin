import prisma from "@/prisma/db";
import https from "https";
import crypto from "crypto";
import { HEALTH_CHECK_DEFAULT_INTERVAL, HEALTH_CHECK_DEFAULT_NOTIFICATION_COOLDOWN } from "@/src/core/config";

async function handleUnavailableServer(server: any) {
    console.log(`[${server.name}] Marking as unavailable...`);

    const now = new Date();

    await prisma.server.update({
        where: { id: server.id },
        data: { isAvailable: false, updatedAt: now }
    });

    await prisma.healthCheck.update({
        where: { serverId: server.id },
        data: {
            isAvailable: false,
            lastCheckedAt: now,
            updatedAt: now
        }
    });

    // TODO: Send notifications
}

function ensureHealthCheckExists(server: any) {
    if (server.healthCheck) return server.healthCheck;

    console.log(`Creating health check for ${server.name}...`);

    return prisma.healthCheck.create({
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

    console.log(`Checking ${server.name} (${url})...`);
    const start = performance.now();

    try {
        const response = await fetch(url, { agent } as any);
        const duration = performance.now() - start;
        const now = new Date();

        if (!response.ok) {
            console.error(`[${server.name}] HTTP ${response.status} - ${response.statusText}`);
            return await handleUnavailableServer(server);
        }

        console.log(`[${server.name}] Healthy (${response.status}) — ${duration.toFixed(0)}ms`);

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
        console.error(`[${server.name}] Error:`, error.message);
        await handleUnavailableServer(server);
    }
}

async function main() {
    console.log("Loading servers from local database...");
    const servers = await prisma.server.findMany({ include: { healthCheck: true } });

    console.log("Starting health checks...");

    for (const server of servers) {
        console.log(`\n=====> { ${server.name} - ${server.hostnameOrIp} }`);

        server.healthCheck = ensureHealthCheckExists(server);

        if (shouldSkipHealthCheck(server.healthCheck)) {
            console.log(`[${server.name}] Skipping — checked recently (interval ${server.healthCheck!.interval}m)`);
            continue;
        }

        await checkServerHealth(server);
    }
}

main()
    .then(() => {
        console.log("\n");
        console.log("══════════════════════════════════════════════════");
        console.log("   Health Check Script Executed Successfully 😎   ");
        console.log("══════════════════════════════════════════════════");
    })
    .catch((error) => {
        console.log("\n");
        console.log("═══════════════════════════════════");
        console.log("   Health Check Script Failed 🥺   ");
        console.log("═══════════════════════════════════");
        console.log("\n");
        console.error(error);
    });

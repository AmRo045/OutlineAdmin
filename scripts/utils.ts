import { spawn } from "child_process";

import { createLogger } from "@/src/core/logger";
import { LoggerContext } from "@/src/core/definitions";

export const startSyncJob = async () => {
    const logger = createLogger(LoggerContext.OutlineSyncJob);

    const syncJobInterval = 90 * 1000;
    let canRunSyncJob = true;
    let shutdownRequestCount = 0;

    const handleShutdown = (signal: string) => {
        if (shutdownRequestCount === 0) {
            logger.warn(`Received ${signal}. Stopping sync job...`);
            logger.warn("Press CTRL + C to terminate the process");
        }

        canRunSyncJob = false;
        shutdownRequestCount++;

        if (shutdownRequestCount > 1) {
            process.exit(0);
        }
    };

    process.on("SIGINT", () => handleShutdown("SIGINT"));
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));

    logger.info("Starting sync job...");

    while (canRunSyncJob) {
        try {
            await runCommand("npm", ["run", "sync"]);
        } catch (error) {
            logger.error("Sync job failed:", error);
        }

        if (canRunSyncJob) {
            await new Promise((resolve) => setTimeout(resolve, syncJobInterval));
        }
    }

    logger.info("Sync job stopped.");
    process.exit(0);
};

export const startHealthCheckJob = async () => {
    const logger = createLogger(LoggerContext.HealthCheckJob);

    const interval = 60 * 1000;
    let canRunJob = true;
    let shutdownRequestCount = 0;

    const handleShutdown = (signal: string) => {
        if (shutdownRequestCount === 0) {
            logger.warn(`Received ${signal}. Stopping sync job...`);
            logger.warn("Press CTRL + C to terminate the process");
        }

        canRunJob = false;
        shutdownRequestCount++;

        if (shutdownRequestCount > 1) {
            process.exit(0);
        }
    };

    process.on("SIGINT", () => handleShutdown("SIGINT"));
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));

    logger.info("Starting health check job...");

    while (canRunJob) {
        try {
            await runCommand("npm", ["run", "health-check"]);
        } catch (error) {
            logger.error("Sync job failed:", error);
        }

        if (canRunJob) {
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    }

    logger.info("Sync job stopped.");
    process.exit(0);
};

export const runCommand = (command: string, args: string[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { stdio: "inherit", shell: true });

        process.on("error", (error) => {
            reject(error);
        });

        process.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command exited with code ${code}`));
            }
        });
    });
};

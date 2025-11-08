import prisma from "@/prisma/db";
import { OutlineSyncService } from "@/src/core/outline/outline-sync-service";
import { createLogger } from "@/src/core/logger";
import { LoggerContext } from "@/src/core/definitions";

let logger = createLogger(LoggerContext.OutlineSyncJob);

const main = async () => {
    logger = createLogger(LoggerContext.OutlineSyncJob);

    logger.info("Loading servers from local database...");
    const servers = await prisma.server.findMany();

    logger.info("Syncing started...");
    for (const server of servers) {
        logger.info(`{${server.name} - ${server.apiId}}`);

        const syncService = new OutlineSyncService(server);

        await syncService.sync();
    }
};

main()
    .then(() => {
        logger.info("Outline Sync Script Executed Successfully 😎");
    })
    .catch((error) => {
        logger.info("Outline Sync Script Failed Successfully 🥺");
        logger.error(error);
    });

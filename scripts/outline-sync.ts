import prisma from "@/prisma/db";
import { OutlineSyncService } from "@/src/core/outline/outline-sync-service";

const main = async () => {
    console.log("Loading servers from local database...");
    const servers = await prisma.server.findMany();

    console.log("Syncing started...");
    for (const server of servers) {
        console.log(`\n=====>{${server.name} - ${server.apiId}}`);

        const syncService = new OutlineSyncService(server);

        await syncService.sync();
    }
};

main()
    .then(() => {
        console.log("\n");
        console.log("══════════════════════════════════════════════════");
        console.log("   Outline Sync Script Executed Successfully 😎   ");
        console.log("══════════════════════════════════════════════════");
    })
    .catch((error) => {
        console.log("\n");
        console.log("════════════════════════════════════════════════");
        console.log("   Outline Sync Script Failed Successfully 🥺   ");
        console.log("════════════════════════════════════════════════");
        console.log("\n");
        console.error(error);
    });

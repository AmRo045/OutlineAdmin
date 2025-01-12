import { runCommand, startSyncJob } from "@/scripts/utils";

const main = async () => {
    startSyncJob();

    try {
        await runCommand("node", ["server.js"]);
    } catch (error) {
        console.error("Failed to start dev server:", error);
        process.exit(1);
    }
};

main().catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
});

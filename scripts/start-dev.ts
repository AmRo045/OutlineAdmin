import { runCommand, startSyncJob } from "@/scripts/utils";

const main = async () => {
    startSyncJob();

    try {
        await runCommand("next", ["dev", "--turbo"]);
    } catch (error) {
        console.error("Failed to start dev server:", error);
        process.exit(1);
    }
};

main().catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
});

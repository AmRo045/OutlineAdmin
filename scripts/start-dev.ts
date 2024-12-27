import { runCommand } from "@/scripts/utils";

const outlineSyncJobInterval = 60 * 1000; // every minute

const main = async () => {
    setInterval(async () => {
        await runCommand("bun", ["sync"]);
    }, outlineSyncJobInterval);

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

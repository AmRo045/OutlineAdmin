import { runCommand } from "./utils";

const outlineSyncJobInterval = 120 * 1000; // every 2 minutes

const main = async () => {
    // setInterval(() => runCommand("bun", ["sync"]), outlineSyncJobInterval);
    //
    // runCommand("bun", ["sync"]).then();

    try {
        await runCommand("bun", ["server.js"]);
    } catch (error) {
        console.error("Failed to start dev server:", error);
        process.exit(1);
    }
};

main().catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
});

import { runCommand } from "@/scripts/utils";

const outlineSyncJobInterval = 120 * 1000; // every 2 minutes

const main = async () => {
    setInterval(() => runCommand("npm", ["run", "sync"]), outlineSyncJobInterval);

    runCommand("npm", ["run", "sync"]).then();

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

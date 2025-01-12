import { spawn } from "child_process";

export const startSyncJob = async () => {
    const syncJobInterval = 60 * 1000;
    let canRunSyncJob = true;

    const handleShutdown = (signal: string) => {
        console.log(`Received ${signal}. Stopping sync job...`);
        canRunSyncJob = false;
    };

    process.on("SIGINT", () => handleShutdown("SIGINT"));
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));

    console.log("Starting sync job...");

    while (canRunSyncJob) {
        try {
            console.log("Running sync command...");
            await runCommand("npm", ["run", "sync"]);
            console.log("Sync command completed successfully.");
        } catch (error) {
            console.error("Sync job failed:", error);
        }

        if (canRunSyncJob) {
            await new Promise((resolve) => setTimeout(resolve, syncJobInterval));
        }
    }

    console.log("Sync job stopped.");
};

export const runCommand = (command: string, args: string[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { stdio: "inherit", shell: true });

        process.on("error", (error) => {
            console.error(`Error executing command: ${command}`, error);
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

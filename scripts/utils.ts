import { spawn } from "child_process";

export const runCommand = (command: string, args: string[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { stdio: "inherit" });

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

import fs from "fs";
import path from "path";

import { runCommand } from "@/scripts/utils";

const main = async () => {
    try {
        await runCommand("next", ["build"]);

        const publicDir = path.join(process.cwd(), ".next", "standalone", "public");
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        const staticDir = path.join(process.cwd(), ".next", "standalone", ".next", "static");
        if (!fs.existsSync(staticDir)) {
            fs.mkdirSync(staticDir, { recursive: true });
        }

        await runCommand("cp", ["-R", "public/*", ".next/standalone/public"]);

        await runCommand("cp", ["-R", ".next/static/*", ".next/standalone/.next/static"]);
    } catch (error) {
        console.error("Failed to build:", error);
        process.exit(1);
    }
};

main().catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
});

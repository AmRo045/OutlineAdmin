import { randomBytes } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const updateSessionSecret = () => {
    const envFilePath = join(process.cwd(), ".env");
    const sessionSecret = randomBytes(32).toString("base64");
    let envFileContent = existsSync(envFilePath) ? readFileSync(envFilePath, "utf8") : "";

    if (envFileContent.includes("SESSION_SECRET")) {
        envFileContent = envFileContent.replace(/SESSION_SECRET=.*/g, `SESSION_SECRET=${sessionSecret}`);
    } else {
        envFileContent += `\nSESSION_SECRET=${sessionSecret}\n`;
    }

    writeFileSync(envFilePath, envFileContent, "utf8");

    console.log("SESSION_SECRET has been updated");
};

updateSessionSecret();

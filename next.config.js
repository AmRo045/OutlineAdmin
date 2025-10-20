const { version } = require("./package.json");

/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        TELEGRAM_API_URL: process.env.TELEGRAM_API_URL,
        VERSION: version
    }
};

module.exports = nextConfig;

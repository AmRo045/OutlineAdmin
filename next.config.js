/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        APP_NAME: process.env.APP_NAME,
        APP_DESCRIPTION: process.env.APP_DESCRIPTION,
        DB_PATH: process.env.DB_PATH
    }
};

module.exports = nextConfig;

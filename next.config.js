/** @type {import("next").NextConfig} */
const nextConfig = {
    env: {
        APP_NAME: process.env.APP_NAME,
        APP_DESCRIPTION: process.env.APP_DESCRIPTION,
        APP_PORT: process.env.APP_PORT,
        DB_PATH: process.env.DB_PATH
    }
};

module.exports = nextConfig;

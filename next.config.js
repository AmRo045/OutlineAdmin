const { version } = require("./package.json");

/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        VERSION: version
    }
};

module.exports = nextConfig;

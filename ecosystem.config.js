module.exports = {
    apps: [
        {
            name: "outline-sync",
            script: "bun",
            args: "sync",
            watch: false,
            cron_restart: "* * * * *", // Run every minute
            autorestart: false,
            max_restarts: 1
        }
    ]
};

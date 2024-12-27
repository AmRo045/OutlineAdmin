module.exports = {
    apps: [
        {
            name: "outline-sync",
            script: "bun",
            args: "sync", // Pass arguments to the script
            watch: false, // Disable watching
            cron_restart: "* * * * *", // Run every minute
            autorestart: false, // Prevent unnecessary restarts
            max_restarts: 1 // Optional: Limit restarts for errors
        }
    ]
};

module.exports = {
  apps: [
    {
      name: "backend", // Name of your app
      script: "npm",
      args: "run dev",
      watch: true, // Enable watching files
      ignore_watch: ["node_modules", "logs"], // Directories to ignore
      watch_delay: 1000, // Delay between restarts
      autorestart: true, // Enable automatic restarts
      restart_delay: 1000, // Delay between restart attempts
      log_type: "json", // Log type set to JSON
      merge_logs: true, // Merge logs for better structure
      log_date_format: "YYYY-MM-DD HH:mm:ss Z", // Format for log dates
      env: {
        NODE_ENV: "development",
      },
      error_file: "./logs/pm2-error.log", // File to log errors
      out_file: "./logs/pm2-out.log", // File to log standard output
    },
  ],
};


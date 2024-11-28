const os = require("node:os");

module.exports = {
  apps: [
    {
      name: "my-app", // Application name
      script: "./src/app.js", // Entry point
      exec_mode: "cluster", // Enable cluster mode
      max_memory_restart: "500M", // Restart if more than 500MB of memory is used
      instances: Math.min(4, os.cpus().length), // Number of instances (use 4 or all CPUs)
      env: {
        NODE_ENV: "development", // Default environment
      },
      env_production: {
        NODE_ENV: "production",
        APP_HOST: "0.0.0.0",
        APP_PORT: "3000",
        APP_MONGO_DATABASE_URL: "mongodb://mongo:27017/pw8",
      },
    },
  ],
};

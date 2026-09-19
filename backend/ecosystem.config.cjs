module.exports = {
  apps: [
    {
      name: 'visionary-api',
      script: 'src/server.js',
      // One instance: live-visitor presence for the admin panel is kept in memory
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '400M',
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      merge_logs: true,
    },
  ],
};

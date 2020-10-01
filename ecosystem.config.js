module.exports = {
  apps: [
    {
      name: 'portfolio-api',
      script: './src/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      max_memory_restart: '100M',
    },
  ],
};

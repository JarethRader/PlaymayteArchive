module.exports = {
  apps: [
    {
      name: 'playmayte',
      script: './dist/server.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

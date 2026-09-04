const { createProxyMiddleware } = require('http-proxy-middleware');
const {
  API_HOST,
  API_BACKEND_PATH,
  useProxy,
} = require('./config/app.config.js');

/**
 * Dev proxy — only if API_BACKEND_PATH is set in app.config.js
 * Restart `npm start` after changing .env files
 */
module.exports = function setupProxy(app) {
  if (!useProxy) {
    return;
  }

  app.use(
    API_BACKEND_PATH,
    createProxyMiddleware({
      target: API_HOST,
      changeOrigin: true,
      secure: true,
      logLevel: 'warn',
    })
  );

  const port = process.env.PORT || 3000;
  console.log(
    `[GHSnapflix] Dev API proxy: http://localhost:${port}${API_BACKEND_PATH} → ${API_HOST}${API_BACKEND_PATH}`
  );
};

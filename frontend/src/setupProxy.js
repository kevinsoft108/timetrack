const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://144.126.254.71:5000',
      // target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
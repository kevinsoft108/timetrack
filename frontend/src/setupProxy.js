const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://64.227.133.148:5000',
      changeOrigin: true,
    })
  );
};
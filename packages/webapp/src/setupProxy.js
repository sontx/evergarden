const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://sontx.ddns.net:3000',
      changeOrigin: true,
    })
  );
};

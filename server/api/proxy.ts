import config from 'config';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default () => {
  return createProxyMiddleware({
    target: config.get('opal-api.url'),
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    logLevel: 'debug',
  });
};

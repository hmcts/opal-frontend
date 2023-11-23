import config from 'config';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default () => {
  return createProxyMiddleware({
    target: config.get('opal-api.url'),
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      if (req.session.securityToken) {
        if (req.session.securityToken.accessToken) {
          proxyReq.setHeader('Authorization', `Bearer ${req.session.securityToken.accessToken}`);
        }
      }
    },
  });
};

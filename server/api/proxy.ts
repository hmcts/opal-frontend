import config from 'config';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default () => {
  return createProxyMiddleware({
    target: config.get('opal-api.url') + '/api',
    changeOrigin: true,
    logger: console,
    on: {
      proxyReq: (proxyReq, req: any) => {
        if (req.session.securityToken) {
          if (req.session.securityToken.accessToken) {
            proxyReq.setHeader('Authorization', `Bearer ${req.session.securityToken.accessToken}`);
          }
        }
      },
    },
  });
};

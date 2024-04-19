import config from 'config';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default () => {
  return createProxyMiddleware({
    changeOrigin: true,
    logger: console,
    router: function () {
      return config.get('opal-api.url') + '/api';
    },
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

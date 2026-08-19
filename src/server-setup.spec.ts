import express from 'express';
import config from 'config';
import { ProxyConfiguration } from '@hmcts/opal-frontend-common-node/interfaces';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { opalApiProxyMock, proxyMiddleware } = vi.hoisted(() => {
  const proxyMiddleware = vi.fn();

  return {
    opalApiProxyMock: vi.fn(() => proxyMiddleware),
    proxyMiddleware,
  };
});

vi.mock('@hmcts/opal-frontend-common-node/proxy/opal-api-proxy', () => ({
  default: opalApiProxyMock,
}));

import { configureApiProxyRoutes, getRoutesConfig } from '../server-setup';

describe('server setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should read the configured API proxy timeout', () => {
    const { proxyConfiguration } = getRoutesConfig();

    expect(proxyConfiguration.timeoutInMilliseconds).toBe(config.get<number>('opal-api.timeoutInMilliseconds'));
  });

  it('should configure both API proxies with the configured timeout', () => {
    const app = express();
    const useSpy = vi.spyOn(app, 'use');
    const timeoutInMilliseconds = 30_000;
    const proxyConfiguration = new ProxyConfiguration({
      opalFinesServiceUrl: 'http://opal-fines-service',
      opalUserServiceUrl: 'http://opal-user-service',
      timeoutInMilliseconds,
    });

    configureApiProxyRoutes(app, proxyConfiguration);

    expect(opalApiProxyMock).toHaveBeenNthCalledWith(
      1,
      'http://opal-fines-service',
      config.get<boolean>('features.ip-logging.enabled'),
      timeoutInMilliseconds,
    );
    expect(opalApiProxyMock).toHaveBeenNthCalledWith(
      2,
      'http://opal-user-service',
      config.get<boolean>('features.ip-logging.enabled'),
      timeoutInMilliseconds,
    );
    expect(useSpy).toHaveBeenNthCalledWith(1, '/opal-fines-service', proxyMiddleware);
    expect(useSpy).toHaveBeenNthCalledWith(2, '/opal-user-service', proxyMiddleware);
  });

  it('should fail before mounting either API proxy when the timeout is missing', () => {
    const app = express();
    const useSpy = vi.spyOn(app, 'use');
    const proxyConfiguration = new ProxyConfiguration({
      opalFinesServiceUrl: 'http://opal-fines-service',
      opalUserServiceUrl: 'http://opal-user-service',
      timeoutInMilliseconds: null,
    });

    expect(() => configureApiProxyRoutes(app, proxyConfiguration)).toThrow(
      'Missing opal-api.timeoutInMilliseconds configuration.',
    );
    expect(opalApiProxyMock).not.toHaveBeenCalled();
    expect(useSpy).not.toHaveBeenCalled();
  });
});

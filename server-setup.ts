import * as express from 'express';
import config from 'config';
import { Helmet } from '@hmcts/opal-frontend-common-node/helmet';
import { CSRFToken } from '@hmcts/opal-frontend-common-node/csrf-token';
import SessionStorage from '@hmcts/opal-frontend-common-node/session/session-storage';
import OpalApiProxy from '@hmcts/opal-frontend-common-node/proxy/opal-api-proxy';
import { AppInsights } from '@hmcts/opal-frontend-common-node/app-insights';
import { LaunchDarkly } from '@hmcts/opal-frontend-common-node/launch-darkly';
import {
  ExpiryConfiguration,
  RoutesConfiguration,
  SessionStorageConfiguration,
  TransferServerState,
  OpalUserServiceConfiguration,
} from '@hmcts/opal-frontend-common-node/interfaces';

const env = process.env['NODE_ENV'] || 'development';
const developmentMode = env === 'development';

export function getRoutesConfig(): {
  sessionExpiryConfiguration: ExpiryConfiguration;
  routesConfiguration: RoutesConfiguration;
  opalUserServiceConfiguration: OpalUserServiceConfiguration;
} {
  const testMode = config.get<boolean>('expiry.testMode');
  const expiryConfigPath = testMode ? 'expiry.test' : 'expiry.default';

  const sessionExpiryConfiguration: ExpiryConfiguration = {
    testMode,
    expiryTimeInMilliseconds: config.get<number>(`${expiryConfigPath}.expiryTimeInMilliseconds`),
    warningThresholdInMilliseconds: config.get<number>(`${expiryConfigPath}.warningThresholdInMilliseconds`),
  };

  const routesConfiguration: RoutesConfiguration = {
    opalApiTarget: config.get('opal-api.url'),
    opalFinesServiceTarget: config.get('opal-api.opal-fines-service'),
    opalUserServiceTarget: config.get('opal-api.opal-user-service'),
    frontendHostname:
      env === 'development' ? config.get('frontend-hostname.dev') : config.get('frontend-hostname.prod'),
    prefix: config.get('session.prefix'),
    clientId: config.get('secrets.opal.AzureADClientId'),
    clientSecret: config.get('secrets.opal.AzureADClientSecret'),
    tenantId: config.get('secrets.opal.AzureADTenantId'),
    microsoftUrl: config.get('microsoft.url'),
  };

  const opalUserServiceConfiguration: OpalUserServiceConfiguration = {
    userStateUrl: config.get('opal-user-service-urls.userStateUrl'),
    addUserUrl: config.get('opal-user-service-urls.addUserUrl'),
    updateUserUrl: config.get('opal-user-service-urls.updateUserUrl'),
  };

  return { sessionExpiryConfiguration, routesConfiguration, opalUserServiceConfiguration };
}

export function configureApiProxyRoutes(app: express.Express): void {
  app.use('/api', OpalApiProxy(config.get('opal-api.url')));
  app.use('/opal-fines-service', OpalApiProxy(config.get('opal-api.opal-fines-service')));
  app.use('/opal-user-service', OpalApiProxy(config.get('opal-api.opal-user-service')));
}

export function configureSession(server: express.Express): void {
  const sessionStorageConfig: SessionStorageConfiguration = {
    secret: config.get('secrets.opal.opal-frontend-cookie-secret'),
    prefix: config.get('session.prefix'),
    maxAge: config.get('session.maxAge'),
    sameSite: config.get('session.sameSite'),
    secure: config.get('session.secure'),
    domain: config.get('session.domain'),
    redisEnabled: config.get('features.redis.enabled'),
    redisConnectionString: config.get('secrets.opal.redis-connection-string'),
  };

  new SessionStorage().enableFor(server, sessionStorageConfig);
}

export function configureCsrf(server: express.Express): void {
  new CSRFToken().enableFor(
    server,
    config.get('secrets.opal.opal-frontend-csrf-secret'),
    config.get('csrf.cookieName'),
    config.get('csrf.sameSite'),
    config.get('csrf.secure'),
  );
}

export function configureSecurityHeaders(server: express.Express): void {
  new Helmet(developmentMode).enableFor(server, config.get('features.helmet.enabled'));
}

export function configureMonitoring(): TransferServerState {
  const launchDarkly = new LaunchDarkly().enableFor(
    config.get('features.launch-darkly.enabled'),
    config.get('features.launch-darkly.stream'),
    config.has('secrets.opal.launch-darkly-client-id') ? config.get('secrets.opal.launch-darkly-client-id') : null,
  );
  const appInsights = new AppInsights().enable(
    config.get('features.app-insights.enabled'),
    config.has('secrets.opal.app-insights-connection-string')
      ? config.get('secrets.opal.app-insights-connection-string')
      : null,
    config.has('application-insights.cloudRoleName') ? config.get('application-insights.cloudRoleName') : null,
  );

  return {
    launchDarklyConfig: launchDarkly,
    ssoEnabled: config.get('features.sso.enabled'),
    appInsightsConfig: appInsights,
    userStateCacheExpirationMilliseconds: config.get('expiry.userStateExpiryInMilliseconds'),
  };
}

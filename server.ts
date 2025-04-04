import { join } from 'node:path';
const domino = require('domino-ext');
const fs = require('fs');
const path = require('path');
const distFolder = join(process.cwd(), 'dist/opal-frontend/browser');
const template = fs.readFileSync(path.join(distFolder, 'index.html')).toString();

const win = domino.createWindow(template.toString());

// Add requires shims here...
global['window'] = win;
global['document'] = win.document;
global['self'] = win;

import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';
import bootstrap from './src/main.server';

import { AppInsights } from '@hmcts/opal-frontend-common-node/app-insights';
import { LaunchDarkly } from '@hmcts/opal-frontend-common-node/launch-darkly';
import {
  TransferServerState,
  ExpiryConfiguration,
  SessionStorageConfiguration,
  RoutesConfiguration,
} from '@hmcts/opal-frontend-common-node/interfaces';
import { HealthCheck } from '@hmcts/opal-frontend-common-node/health';
import { Helmet } from '@hmcts/opal-frontend-common-node/helmet';
import { PropertiesVolume } from '@hmcts/opal-frontend-common-node/properties-volume';
import { CSRFToken } from '@hmcts/opal-frontend-common-node/csrf-token';
import { Routes } from '@hmcts/opal-frontend-common-node/routes';
import SessionStorage from '@hmcts/opal-frontend-common-node/session/session-storage';

const env = process.env['NODE_ENV'] || 'development';
const developmentMode = env === 'development';

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

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/opal-frontend/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  new PropertiesVolume().enableFor(server, config);
  new SessionStorage().enableFor(server, sessionStorageConfig);
  new CSRFToken().enableFor(
    server,
    config.get('secrets.opal.opal-frontend-csrf-secret'),
    config.get('csrf.cookieName'),
    config.get('csrf.sameSite'),
    config.get('csrf.secure'),
  );
  new HealthCheck().enableFor(server, 'opal-frontend');
  // secure the application by adding various HTTP headers to its responses
  new Helmet(developmentMode).enableFor(server, config.get('features.helmet.enabled'));

  const testMode = config.get<boolean>('expiry.testMode');
  const expiryConfigPath = testMode ? 'expiry.test' : 'expiry.default';
  const sessionExpiryConfiguration: ExpiryConfiguration = {
    testMode: config.get<boolean>('expiry.testMode'),
    expiryTimeInMilliseconds: config.get<number>(`${expiryConfigPath}.expiryTimeInMilliseconds`),
    warningThresholdInMilliseconds: config.get<number>(`${expiryConfigPath}.warningThresholdInMilliseconds`),
  };
  const env = process.env['NODE_ENV'] || 'development';
  const routesConfiguration: RoutesConfiguration = {
    opalApiTarget: config.get('opal-api.url'),
    opalFinesServiceTarget: config.get('opal-api.opal-fines-service'),
    frontendHostname:
      env === 'development' ? config.get('frontend-hostname.dev') : config.get('frontend-hostname.prod'),
    prefix: config.get('session.prefix'),
  };

  new Routes().enableFor(server, config.get('features.sso.enabled'), sessionExpiryConfiguration, routesConfiguration);

  const launchDarkly = new LaunchDarkly().enableFor(
    config.get('features.launch-darkly.enabled'),
    config.get('features.launch-darkly.stream'),
    config.has('secrets.opal.launch-darkly-client-id') ? config.get('features.launch-darkly.clientId') : null,
  );
  const appInsights = new AppInsights().enable(
    config.get('features.app-insights.enabled'),
    config.has('features.app-insights.connection-string')
      ? config.get('features.app-insights.connection-string')
      : null,
    config.has('features.app-insights.cloudRoleName') ? config.get('features.app-insights.cloudRoleName') : null,
  );
  const serverTransferState: TransferServerState = {
    launchDarklyConfig: launchDarkly,
    ssoEnabled: config.get('features.sso.enabled'),
    appInsightsConfig: appInsights,
  };

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    }),
  );

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          {
            provide: 'serverTransferState',
            useValue: serverTransferState,
          },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const logger = Logger.getLogger('server');

  // Start up the Node server
  const server = app();

  server.listen(port, () => {
    logger.info(`Server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

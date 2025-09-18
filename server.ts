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

import {
  getRoutesConfig,
  configureApiProxyRoutes,
  configureSession,
  configureCsrf,
  configureSecurityHeaders,
  configureMonitoring,
} from './server-setup';

import { SessionConfiguration, SsoConfiguration } from '@hmcts/opal-frontend-common-node/interfaces';
import { HealthCheck } from '@hmcts/opal-frontend-common-node/health';
import { PropertiesVolume } from '@hmcts/opal-frontend-common-node/properties-volume';
import { Routes } from '@hmcts/opal-frontend-common-node/routes';

const indexHtml = existsSync(join(distFolder, 'index.original.html'))
  ? join(distFolder, 'index.original.html')
  : join(distFolder, 'index.html');

const sessionConfiguration: SessionConfiguration = {
  sessionExpiryUrl: '/session/expiry',
};

const ssoConfiguration: SsoConfiguration = {
  login: '/sso/login',
  loginCallback: '/sso/login-callback',
  logout: '/sso/logout',
  logoutCallback: '/sso/logout-callback',
  authenticated: '/sso/authenticated',
};

function app(): express.Express {
  const server = express();

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  new PropertiesVolume().enableFor(server, config);
  configureSession(server);
  configureCsrf(server);
  configureSecurityHeaders(server);
  new HealthCheck().enableFor(server, 'opal-frontend');

  const { sessionExpiryConfiguration, routesConfiguration } = getRoutesConfig();

  configureApiProxyRoutes(server);

  server.get('/health', (_, res, next) => {
    res.status(200).send('OK');
  });

  new Routes().enableFor(
    server,
    config.get('features.sso.enabled'),
    sessionExpiryConfiguration,
    routesConfiguration,
    sessionConfiguration,
    ssoConfiguration,
  );

  const serverTransferState = configureMonitoring();

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    }),
  );

  // All regular routes use the Angular engine
  server.get('*', async (req, res, next) => {
    try {
      const { protocol, originalUrl, baseUrl, headers } = req;

      const html = await commonEngine.render({
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
      });

      res.send(html);
    } catch (err) {
      Logger.getLogger('SSR').error('SSR render failed', err);
      next(err);
    }
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

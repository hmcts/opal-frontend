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
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
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

const serverLogger = Logger.getLogger('server');
const ssrLogger = Logger.getLogger('SSR');

function app(): Express {
  const server = express();

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  new PropertiesVolume().enableFor(server, config);
  configureSession(server);
  configureCsrf(server);
  configureSecurityHeaders(server);
  new HealthCheck().enableFor(server, 'opal-frontend');

  const { sessionExpiryConfiguration, routesConfiguration, opalUserServiceConfiguration } = getRoutesConfig();

  configureApiProxyRoutes(server);

  server.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  new Routes().enableFor(
    server,
    config.get('features.sso.enabled'),
    sessionExpiryConfiguration,
    routesConfiguration,
    sessionConfiguration,
    ssoConfiguration,
    opalUserServiceConfiguration,
  );

  const serverTransferState = configureMonitoring();

  // Serve static files from /browser. Using middleware instead of wildcard route
  // avoids path-to-regexp wildcard errors introduced in Express 5.
  server.use(
    express.static(distFolder, {
      maxAge: '1y',
      index: false,
    }),
  );

  // All regular routes use the Angular engine
  server.get(/.*/, async (req: Request, res: Response, next: NextFunction) => {
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
      ssrLogger.error('SSR render failed', err);
      next(err);
    }
  });

  server.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    serverLogger.error(`Unhandled error processing ${req.method} ${req.originalUrl}`, err);

    if (res.headersSent) {
      return next(err);
    }

    res.status(500).send('Internal Server Error');
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();

  server.listen(port, () => {
    serverLogger.info(`Server listening on http://localhost:${port}`);
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

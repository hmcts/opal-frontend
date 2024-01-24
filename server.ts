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
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { AppServerModule } from './src/main.server';

import { Logger } from '@hmcts/nodejs-logging';
import healthCheck from '@hmcts/nodejs-healthcheck';

import routes from './server/routes';
import { AppInsights, Helmet, PropertiesVolume } from './server/modules';
import sessionStorage from './server/session/session-storage';

const env = process.env['NODE_ENV'] || 'development';
const developmentMode = env === 'development';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/opal-frontend/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  const healthConfig = {
    checks: {},
    buildInfo: {},
  };

  healthCheck.addTo(server, healthConfig);

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  // server.use(session());
  sessionStorage(server);
  server.use(routes());

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
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
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

  new PropertiesVolume().enableFor(server);

  new AppInsights().enable();
  // secure the application by adding various HTTP headers to its responses
  new Helmet(developmentMode).enableFor(server);

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

export default AppServerModule;

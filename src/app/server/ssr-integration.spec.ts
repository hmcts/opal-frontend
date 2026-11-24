// @vitest-environment node
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter, RouterOutlet } from '@angular/router';
import { CommonEngine } from '@angular/ssr/node';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import express from 'express';
import { get } from 'node:http';
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';
import { throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { finesRouting } from '../flows/fines/routing/fines.routes';
import { renderSsrResponse } from './ssr-response';

@Component({
  selector: 'app-test-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestAppComponent {}

describe('SSR SSO redirect integration', () => {
  it('redirects an unauthenticated fines deep link to SSO login', async () => {
    const domino = createRequire(import.meta.url)('domino-ext') as { createWindow(html: string): Window };
    const window = domino.createWindow('<!doctype html><html><head></head><body></body></html>');
    vi.stubGlobal('window', window);
    vi.stubGlobal('document', window.document);
    vi.stubGlobal('self', window);
    const checkAuthenticated = vi.fn(() => throwError(() => new HttpErrorResponse({ status: 401 })));
    const getLoggedInUserState = vi.fn();
    const bootstrap = (context: BootstrapContext) =>
      bootstrapApplication(
        TestAppComponent,
        {
          providers: [
            provideServerRendering(),
            provideRouter(finesRouting),
            { provide: AuthService, useValue: { checkAuthenticated } },
            { provide: OpalUserService, useValue: { clearUserStateCache: vi.fn(), getLoggedInUserState } },
            { provide: GlobalStore, useValue: { ssoEnabled: () => true } },
          ],
        },
        context,
      );

    const engine = new CommonEngine({ allowedHosts: ['localhost'] });
    const app = express();
    app.get(/.*/, (req, res, next) => {
      void renderSsrResponse(
        engine,
        {
          bootstrap,
          document: '<!doctype html><html><head></head><body><app-test-root></app-test-root></body></html>',
          url: `http://localhost${req.originalUrl}`,
          inlineCriticalCss: false,
        },
        res,
        { login: '/sso/login', logout: '/sso/logout' },
      ).catch(next);
    });
    const server = app.listen(0, '127.0.0.1');
    let listening = false;
    try {
      await new Promise<void>((resolve, reject) => server.once('listening', resolve).once('error', reject));
      listening = true;
      const { port } = server.address() as AddressInfo;
      const result = await new Promise<{ status?: number; location?: string }>((resolve, reject) => {
        get(`http://127.0.0.1:${port}/fines/dashboard/search`, (response) => {
          const result = { status: response.statusCode, location: response.headers.location };
          response.resume();
          response.on('end', () => resolve(result));
        }).on('error', reject);
      });
      expect(result).toEqual({ status: 302, location: '/sso/login' });
    } finally {
      if (listening) {
        await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
      }
      vi.unstubAllGlobals();
    }

    expect(checkAuthenticated).toHaveBeenCalled();
    expect(getLoggedInUserState).not.toHaveBeenCalled();
  });
});

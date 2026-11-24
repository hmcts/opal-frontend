// @vitest-environment node
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter, RouterOutlet, type Routes } from '@angular/router';
import { CommonEngine } from '@angular/ssr/node';
import { signedInGuard } from '@hmcts/opal-frontend-common/guards/signed-in';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import express from 'express';
import { get } from 'node:http';
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';
import { describe, expect, it, vi } from 'vitest';
import { finesRouting } from '../flows/fines/routing/fines.routes';
import { renderSsrResponse } from './ssr-response';
import { getSsrSessionCookie, SSR_SESSION_CONTEXT, ssrSessionInterceptor } from './ssr-session.interceptor';

@Component({
  selector: 'app-test-outlet',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestOutletComponent {}

@Component({
  selector: 'app-test-account',
  template: '<p>Account: {{ store.userState().username }}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestAccountComponent {
  protected readonly store = inject(GlobalStore);
}

@Component({
  selector: 'app-test-sign-in',
  template: '<p>Sign in</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestSignInComponent {}

describe('SSR session handling', () => {
  it('keeps concurrent authenticated and anonymous requests isolated', async () => {
    const domino = createRequire(import.meta.url)('domino-ext') as { createWindow(html: string): Window };
    const window = domino.createWindow('<!doctype html><html><head></head><body></body></html>');
    vi.stubGlobal('window', window);
    vi.stubGlobal('document', window.document);
    vi.stubGlobal('self', window);

    const finesParent = finesRouting.find((route) => route.path === 'fines' && route.canActivateChild);
    expect(finesParent).toBeDefined();
    const routes: Routes = [
      {
        path: 'fines',
        component: TestOutletComponent,
        canActivateChild: finesParent!.canActivateChild,
        children: [
          {
            path: 'dashboard',
            component: TestOutletComponent,
            children: [
              {
                path: 'search',
                component: TestAccountComponent,
                resolve: { account: () => inject(HttpClient).get('/opal-fines-service/test-account') },
              },
            ],
          },
        ],
      },
      { path: 'sign-in', component: TestSignInComponent, canActivate: [signedInGuard] },
    ];
    const bootstrap = (ssoEnabled: boolean) => (context: BootstrapContext) =>
      bootstrapApplication(
        TestOutletComponent,
        {
          providers: [
            provideServerRendering(),
            provideRouter(routes),
            provideHttpClient(withFetch(), withInterceptors([ssrSessionInterceptor])),
            provideAppInitializer(() => {
              const store = inject(GlobalStore);
              store.setSsoEnabled(ssoEnabled);
              store.setUserStateDomain('fines');
              store.setUserStateCacheExpirationMilliseconds(60000);
            }),
          ],
        },
        context,
      );

    const app = express();
    const requests: { path: string; cookie?: string }[] = [];
    app.get('/sso/authenticated', (req, res) => {
      requests.push({ path: req.path, cookie: req.headers.cookie });
      if (
        [
          'test-session=alpha',
          'test-session=beta',
          'test-session=local-mismatch',
          'test-session=sso-mismatch',
        ].includes(req.headers.cookie ?? '')
      ) {
        res.json(true);
      } else {
        res.status(401).json(false);
      }
    });
    app.get('/api/user-state', (req, res) => {
      requests.push({ path: req.path, cookie: req.headers.cookie });
      if (req.headers.cookie === 'test-session=local-mismatch' || req.headers.cookie === 'test-session=sso-mismatch') {
        res.sendStatus(401);
        return;
      }
      const username = req.headers.cookie === 'test-session=alpha' ? 'alpha' : 'beta';
      res.json({
        user_id: username === 'alpha' ? 1 : 2,
        username,
        name: username,
        status: 'ACTIVE',
        version: 1,
        domains: { fines: { business_unit_users: [] } },
      });
    });
    app.get('/opal-fines-service/test-account', (req, res) => {
      requests.push({ path: req.path, cookie: req.headers.cookie });
      res.json({ ok: true });
    });
    app.get('/sso/logout', (req, res) => {
      requests.push({ path: req.path, cookie: req.headers.cookie });
      res.redirect('/');
    });
    const engine = new CommonEngine({ allowedHosts: ['127.0.0.1'] });
    let port = 0;
    app.get(/.*/, (req, res, next) => {
      const cookie = getSsrSessionCookie(req.headers.cookie, 'test-session');
      void renderSsrResponse(
        engine,
        {
          bootstrap: bootstrap(cookie !== 'test-session=local-mismatch'),
          document:
            '<!doctype html><html><head><base href="/"></head><body><app-test-outlet></app-test-outlet></body></html>',
          url: `http://127.0.0.1:${port}${req.originalUrl}`,
          inlineCriticalCss: false,
          providers: [
            {
              provide: SSR_SESSION_CONTEXT,
              useValue: { port, cookie },
            },
          ],
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
      port = (server.address() as AddressInfo).port;
      const request = (cookie?: string) =>
        new Promise<{ status?: number; location?: string; body: string }>((resolve, reject) => {
          get(
            { hostname: '127.0.0.1', port, path: '/fines/dashboard/search', headers: cookie ? { cookie } : {} },
            (response) => {
              let body = '';
              response.setEncoding('utf8');
              response.on('data', (chunk: string) => {
                body += chunk;
              });
              response.on('end', () =>
                resolve({ status: response.statusCode, location: response.headers.location, body }),
              );
            },
          ).on('error', reject);
        });
      const [alpha, beta, anonymous, localMismatch, ssoMismatch] = await Promise.all([
        request('unrelated=one; test-session=alpha'),
        request('test-session=beta; unrelated=two'),
        request(),
        request('test-session=local-mismatch'),
        request('test-session=sso-mismatch'),
      ]);
      expect(alpha.status).toBe(200);
      expect(alpha.body).toContain('Account: alpha');
      expect(alpha.body).not.toContain('Account: beta');
      expect(beta.status).toBe(200);
      expect(beta.body).toContain('Account: beta');
      expect(beta.body).not.toContain('Account: alpha');
      expect(anonymous.status).toBe(302);
      expect(anonymous.location).toBe('/sso/login');
      expect(localMismatch.status).toBe(200);
      expect(localMismatch.body).toContain('Sign in');
      expect(ssoMismatch.status).toBe(302);
      expect(ssoMismatch.location).toBe('/sso/logout');
      expect(
        requests
          .filter((item) => item.path === '/api/user-state')
          .map((item) => item.cookie)
          .sort(),
      ).toEqual([
        'test-session=alpha',
        'test-session=beta',
        'test-session=local-mismatch',
        'test-session=sso-mismatch',
      ]);
      expect(
        requests
          .filter((item) => item.path === '/opal-fines-service/test-account')
          .map((item) => item.cookie)
          .sort(),
      ).toEqual(['test-session=alpha', 'test-session=beta']);
      expect(requests.filter((item) => item.path === '/sso/logout').map((item) => item.cookie)).toEqual([
        'test-session=local-mismatch',
      ]);
    } finally {
      if (listening)
        await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
      vi.unstubAllGlobals();
    }
  });
});

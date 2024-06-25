import config from 'config';
import { Application } from 'express';
import { doubleCsrf } from 'csrf-csrf';

export class CSRFToken {
  public enableFor(app: Application): void {
    const ignore = [
      '/sso/login',
      '/sso/logout',
      '/sso/authenticated',
      '/sso/login-callback',
      '/sso/logout-callback',
      '/styles.css.map',
      '/',
    ];

    const { doubleCsrfProtection } = doubleCsrf({
      getSecret: () => 'this is a test', // NEVER DO THIS
      cookieName: 'XSRF-TOKEN', // Prefer "__Host-" prefixed names if possible
      cookieOptions: { sameSite: 'lax', secure: false, path: '/' },
      getTokenFromRequest: (req) => {
        return req.cookies['XSRF-TOKEN'].split('|')[0] || null;
      },
    });

    app.use((req, res, next) => {
      if (ignore.includes(req.url)) {
        next();
      } else {
        doubleCsrfProtection(req, res, next);
      }
    });

    app.use((req, res, next) => {
      if (req.csrfToken) {
        req.csrfToken(true);
      }
      next();
    });
  }
}

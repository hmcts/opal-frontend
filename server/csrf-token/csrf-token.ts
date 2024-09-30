import config from 'config';
import { doubleCsrf } from 'csrf-csrf';
import { Application, Request } from 'express';

export class CSRFToken {
  public enableFor(app: Application): void {
    const ignore = ['/sso/login-callback'];

    const { doubleCsrfProtection } = doubleCsrf({
      getSecret: () => config.get('secrets.opal.opal-frontend-csrf-secret'),
      cookieName: config.get('csrf.cookieName'),
      cookieOptions: { sameSite: config.get('csrf.sameSite'), secure: config.get('csrf.secure'), path: '/' },
      getTokenFromRequest: (req) => {
        const cookieName = config.get('csrf.cookieName');
        return req.cookies[cookieName as string].split('|')[0] || null;
      },
    });

    app.use((req, res, next) => {
      if (ignore.includes(req.url)) {
        next();
      } else {
        doubleCsrfProtection(req, res, next);
      }
    });

    app.use((req: Request, res, next) => {
      if (req.csrfToken) {
        req.csrfToken(true);
      }
      next();
    });
  }
}

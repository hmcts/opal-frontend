import config from 'config';
import { Application } from 'express';
import csurf from 'csurf';

export class CSRFToken {
  public enableFor(app: Application): void {
    const ignore = [
      '/sso/login',
      '/sso/logout',
      '/sso/authenticated',
      '/sso/login-callback',
      '/sso/logout-callback',
      '/styles.css.map',
    ];

    const csrfProtection = csurf({
      cookie: { httpOnly: true, sameSite: 'lax', secure: config.get('session.secure') },
      ignoreMethods: ['GET'],
    });

    app.use((req, res, next) => {
      if (ignore.includes(req.url)) {
        next();
      } else {
        csrfProtection(req, res, next);
      }
    });

    app.use((req, res, next) => {
      if (req.csrfToken) {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {
          sameSite: 'lax',
          secure: config.get('session.secure'),
        });
      }
      next();
    });
  }
}

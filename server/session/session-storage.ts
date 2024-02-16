import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import { createClient } from 'redis';
import FileStoreFactory from 'session-file-store';

const FileStore = FileStoreFactory(session);
const logger = Logger.getLogger('session-storage');

export default class SessionStorage {
  public enableFor(app: Application): void {
    app.use(cookieParser(config.get('secrets.opal.opal-frontend-session-secret')));
    app.set('trust proxy', 1);

    app.use(
      session({
        name: config.get('session.prefix'),
        resave: false,
        saveUninitialized: false,
        secret: config.get('secrets.opal.opal-frontend-session-secret'),
        cookie: {
          httpOnly: true,
          maxAge: config.get('session.maxAge'),
          sameSite: 'lax',
          secure: config.get('session.secure'),
        },
        rolling: true,
        store: this.getStore(app),
      }),
    );
  }

  private getStore(app: Application) {
    if (config.get('features.redis.enabled')) {
      logger.info('Using Redis session store', config.get('secrets.opal.redis-connection-string'));
      const client = createClient({
        url: config.get('secrets.opal.redis-connection-string'),
      });

      client.connect().catch(logger.error);

      app.locals['redisClient'] = client;
      return new RedisStore({ client });
    }

    return new FileStore({ path: '/tmp' });
  }
}

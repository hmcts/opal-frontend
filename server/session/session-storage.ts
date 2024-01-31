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
    app.use(cookieParser());
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
        store: this.getStore(),
      }),
    );
  }

  private getStore() {
    logger.info('redis enabled', config.get('features.redis.enabled'));
    if (config.get('features.redis.enabled')) {
      logger.info('Using Redis session store', config.get('secrets.opal.redis-connection-string'));
      const client = createClient({ url: config.get('secrets.opal.redis-connection-string') });

      logger.info('Connecting to Redis');
      client.connect().catch(logger.error);

      try {
        logger.info('Pinging Redis');
        client.ping().then((pong) => {
          logger.info('ping', pong);
          logger.info('Redis connected');
        });
      } catch (error) {
        logger.error('Redis ping failed', error);
      }

      return new RedisStore({ client });
    }

    return new FileStore({ path: '/tmp' });
  }
}

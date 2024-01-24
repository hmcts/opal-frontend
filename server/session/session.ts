import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import config from 'config';
import FileStoreFactory from 'session-file-store';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import { Logger } from '@hmcts/nodejs-logging';

export default () => {
  const sessionMiddleware: session.SessionOptions = {
    secret: config.get('secrets.opal.opal-frontend-session-secret'),
    resave: false,
    saveUninitialized: true,
    cookie: {},
  };

  if (config.get('features.redis.enabled')) {
    console.log(`Connection string is ${config.get('secrets.opal.redis-connection-string')}`);
    const redisClient = createClient({ url: config.get('secrets.opal.redis-connection-string') });
    redisClient.connect().catch(console.error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const redisStore = new (RedisStore as any)({
      client: redisClient,
      prefix: config.get('session.prefix') + ':',
      ttl: config.get('session.ttlInSeconds'),
    });
    sessionMiddleware.store = redisStore;

    if (sessionMiddleware.cookie) {
      sessionMiddleware.cookie.secure = true; // serve secure cookies
    }
  }

  return session(sessionMiddleware);
};

const FileStore = FileStoreFactory(session);

export class SessionStorage {
  public enableFor(app: Application): void {
    app.use(cookieParser());
    app.set('trust proxy', 1);

    app.use(
      session({
        name: 'nfdiv-session',
        resave: false,
        saveUninitialized: false,
        secret: config.get('secrets.opal.opal-frontend-session-secret'),
        cookie: {
          httpOnly: true,
          maxAge: 720000,
          sameSite: 'lax', // required for the oauth2 redirect
          secure: false,
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
        store: this.getStore(app),
      })
    );
  }

  private getStore(app: Application) {
    if (config.get('features.redis.enabled')) {
      console.log('redis enabled');
      const client = createClient({ url: config.get('secrets.opal.redis-connection-string') });
      // const client = redis.createClient({
      //   socket: {
      //     host: redisHost as string,
      //     port: 6380,
      //     connectTimeout: 15000,
      //     tls: true,
      //   },
      //   password: config.get('session.redis.key') as string,
      // });

      client.connect().catch(console.log);

      // app.locals.redisClient = client;
      return new RedisStore({ client });
    }

    return new FileStore({ path: '/tmp' });
  }
}
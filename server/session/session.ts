import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import config from 'config';
import { Logger } from '@hmcts/nodejs-logging';

export default () => {
  const logger = Logger.getLogger('session');
  const sessionMiddleware: session.SessionOptions = {
    secret: config.get('secrets.opal.opal-frontend-session-secret'),
    resave: false,
    saveUninitialized: true,
    cookie: {},
  };

  logger.info('Using in-memory session store', config.get('secrets.opal.opal-frontend-session-secret'));

  if (config.get('features.redis.enabled')) {
    logger.info('Using Redis session store', config.get('secrets.opal.redis-connection-string'));
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

  logger.info('Session middleware configured', sessionMiddleware);
  return session(sessionMiddleware);
};

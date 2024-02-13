import config from 'config';

import { Application } from 'express';

import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

export default class RateLimit {
  public enableFor(app: Application): void {
    if (config.get('features.redis.enabled')) {
      app.use(
        rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
          standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
          legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
          store: this.getStore(app),
        }),
      );
    }
  }

  private getStore(app: Application) {
    return new RedisStore({ sendCommand: (...args: string[]) => app.locals['redisClient'].sendCommand(args) });
  }
}

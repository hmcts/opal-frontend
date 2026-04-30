import type { Express, Request } from 'express';
import axios from 'axios';
import config from 'config';

const USER_STATE_CACHE_KEY_PREFIX = 'USER_STATE_';

interface JwtPayload {
  sub?: unknown;
}

interface UserStateRedisClient {
  get(key: string): Promise<string | null>;
}

interface UserStateServiceResponse {
  data: unknown;
  status: number;
}

type UserStateRequest = Request & {
  session?: {
    securityToken?: {
      access_token?: string;
    };
  };
};

function getUserStateRedisClient(app: Express): UserStateRedisClient | null {
  const redisClient: unknown = app.locals['redisClient'];
  const candidate = redisClient as { get?: unknown };

  return typeof candidate?.get === 'function' ? (candidate as UserStateRedisClient) : null;
}

function decodeJwtPayload(accessToken: string): JwtPayload | null {
  const payload = accessToken.split('.')[1];

  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decodedPayload: unknown = JSON.parse(Buffer.from(paddedBase64, 'base64').toString('utf8'));

    return decodedPayload && typeof decodedPayload === 'object' ? (decodedPayload as JwtPayload) : null;
  } catch {
    return null;
  }
}

function getUserStateCacheKey(accessToken: string): string | null {
  const subject = decodeJwtPayload(accessToken)?.sub;

  if (typeof subject !== 'string' || !subject.trim()) {
    return null;
  }

  return `${USER_STATE_CACHE_KEY_PREFIX}${subject}`;
}

function parseCachedUserState(cachedUserState: string): unknown | null {
  try {
    const userState: unknown = JSON.parse(cachedUserState);

    return userState && typeof userState === 'object' ? userState : null;
  } catch {
    return null;
  }
}

async function getCachedUserState(app: Express, cacheKey: string): Promise<unknown | null> {
  const redisClient = getUserStateRedisClient(app);

  if (!redisClient) {
    return null;
  }

  try {
    const cachedUserState = await redisClient.get(cacheKey);

    return cachedUserState ? parseCachedUserState(cachedUserState) : null;
  } catch {
    return null;
  }
}

async function getUserStateFromUserService(accessToken: string): Promise<UserStateServiceResponse> {
  const opalUserServiceUrl = config.get<string>('opal-api.opal-user-service');
  const userStateUrl = config.get<string>('opal-user-service-urls.userStateUrl');

  try {
    const response = await axios.get<unknown>(`${opalUserServiceUrl}${userStateUrl}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      validateStatus: () => true,
    });

    return {
      data: response.data,
      status: response.status,
    };
  } catch {
    return {
      data: { message: 'Unable to retrieve user state' },
      status: 502,
    };
  }
}

export function configureUserStateRoute(app: Express): void {
  app.get('/api/user-state', async (req, res) => {
    const accessToken = (req as UserStateRequest).session?.securityToken?.access_token;

    if (!accessToken) {
      res.sendStatus(401);
      return;
    }

    const cacheKey = getUserStateCacheKey(accessToken);

    if (!cacheKey) {
      res.sendStatus(401);
      return;
    }

    const cachedUserState = await getCachedUserState(app, cacheKey);

    if (cachedUserState) {
      res.status(200).json(cachedUserState);
      return;
    }

    const userStateResponse = await getUserStateFromUserService(accessToken);
    res.status(userStateResponse.status).send(userStateResponse.data);
  });
}

import type { Express, Request, Response } from 'express';
import axios from 'axios';
import config from 'config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureUserStateRoute } from './user-state-route';

interface TestSession {
  securityToken?: {
    access_token?: string;
  };
}

interface TestRedisClient {
  get: ReturnType<typeof vi.fn>;
}

interface TestResponse {
  body: unknown;
  status: number;
}

interface ResponseHarness {
  getResponse: () => TestResponse;
  res: Response;
}

interface RegisteredRoute {
  handler: RouteHandler;
  method: 'get' | 'use';
  path: string;
}

interface RouteHarness {
  app: Express;
  registrations: RegisteredRoute[];
  run: (session?: TestSession) => Promise<TestResponse>;
}

type RouteHandler = (req: Request, res: Response) => Promise<void> | void;

const subject = 'SvS8xT7bd9MYoUd3vuscoJoMNpZZuumQhTK6bg62HDY';
const cacheKey = `USER_STATE_${subject}`;

const axiosGetMock = vi.spyOn(axios, 'get');
const configGetMock = vi.spyOn(config, 'get');

function createAccessToken(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  return `${header}.${encodedPayload}.signature`;
}

const accessToken = createAccessToken({ sub: subject });

function getConfigValue<T>(key: string): T {
  if (key === 'opal-api.opal-user-service') {
    return 'http://opal-user-service.test' as T;
  }

  if (key === 'opal-user-service-urls.userStateUrl') {
    return '/v2/users/0/state' as T;
  }

  throw new Error(`Unexpected config key: ${key}`);
}

function createRouteHarness({ redisClient }: { redisClient?: TestRedisClient } = {}): RouteHarness {
  const registrations: RegisteredRoute[] = [];
  const app = {
    locals: {} as Record<string, unknown>,
    get: vi.fn((path: string, handler: RouteHandler) => {
      registrations.push({ handler, method: 'get', path });
      return app;
    }),
    use: vi.fn((path: string, handler: RouteHandler) => {
      registrations.push({ handler, method: 'use', path });
      return app;
    }),
  };

  if (redisClient) {
    app.locals['redisClient'] = redisClient;
  }

  configureUserStateRoute(app as unknown as Express);

  return {
    app: app as unknown as Express,
    registrations,
    run: (session = { securityToken: { access_token: accessToken } }) => runUserStateRoute(registrations, session),
  };
}

function createResponse(): ResponseHarness {
  let body: unknown;
  let status = 200;
  const res = {
    json: vi.fn((nextBody: unknown) => {
      body = nextBody;
      return res;
    }),
    send: vi.fn((nextBody: unknown) => {
      body = nextBody;
      return res;
    }),
    sendStatus: vi.fn((nextStatus: number) => {
      status = nextStatus;
      return res;
    }),
    status: vi.fn((nextStatus: number) => {
      status = nextStatus;
      return res;
    }),
  };

  return {
    getResponse: () => ({ body, status }),
    res: res as unknown as Response,
  };
}

async function runUserStateRoute(registrations: RegisteredRoute[], session: TestSession): Promise<TestResponse> {
  const userStateRoute = registrations.find(
    (registration) => registration.method === 'get' && registration.path === '/api/user-state',
  );

  if (!userStateRoute) {
    throw new Error('GET /api/user-state was not registered');
  }

  const req = { session } as unknown as Request;
  const { getResponse, res } = createResponse();

  await userStateRoute.handler(req, res);

  return getResponse();
}

describe('configureUserStateRoute', () => {
  beforeEach(() => {
    axiosGetMock.mockReset();
    configGetMock.mockReset();
    configGetMock.mockImplementation(getConfigValue);
  });

  it('should return cached user state from Redis without calling user service', async () => {
    const cachedUserState = {
      cache_name: cacheKey,
      domains: {
        fines: {
          business_unit_users: [],
        },
      },
    };
    const redisClient = {
      get: vi.fn().mockResolvedValue(JSON.stringify(cachedUserState)),
    };

    const response = await createRouteHarness({ redisClient }).run();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(cachedUserState);
    expect(redisClient.get).toHaveBeenCalledWith(cacheKey);
    expect(axiosGetMock).not.toHaveBeenCalled();
  });

  it('should call user service and return its response when Redis has no user state', async () => {
    const userState = {
      cache_name: cacheKey,
      domains: {
        fines: {
          business_unit_users: [],
        },
      },
    };
    const redisClient = {
      get: vi.fn().mockResolvedValue(null),
    };
    axiosGetMock.mockResolvedValue({ data: userState, status: 200 });

    const response = await createRouteHarness({ redisClient }).run();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(userState);
    expect(redisClient.get).toHaveBeenCalledWith(cacheKey);
    expect(axiosGetMock).toHaveBeenCalledWith(
      'http://opal-user-service.test/v2/users/0/state',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        validateStatus: expect.any(Function),
      }),
    );
  });

  it('should call user service when Redis contains invalid JSON', async () => {
    const userState = {
      cache_name: cacheKey,
      domains: {
        fines: {
          business_unit_users: [],
        },
      },
    };
    const redisClient = {
      get: vi.fn().mockResolvedValue('not-json'),
    };
    axiosGetMock.mockResolvedValue({ data: userState, status: 200 });

    const response = await createRouteHarness({ redisClient }).run();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(userState);
    expect(redisClient.get).toHaveBeenCalledWith(cacheKey);
    expect(axiosGetMock).toHaveBeenCalledOnce();
  });

  it('should return 401 when no session access token exists', async () => {
    const response = await createRouteHarness().run({});

    expect(response.status).toBe(401);
    expect(axiosGetMock).not.toHaveBeenCalled();
  });

  it('should return 401 when the access token cannot provide a cache key', async () => {
    const redisClient = {
      get: vi.fn(),
    };
    const response = await createRouteHarness({ redisClient }).run({
      securityToken: {
        access_token: createAccessToken({}),
      },
    });

    expect(response.status).toBe(401);
    expect(redisClient.get).not.toHaveBeenCalled();
    expect(axiosGetMock).not.toHaveBeenCalled();
  });

  it('should return a controlled 502 when the user service request fails', async () => {
    const redisClient = {
      get: vi.fn().mockResolvedValue(null),
    };
    axiosGetMock.mockRejectedValue(new Error('connection refused'));

    const response = await createRouteHarness({ redisClient }).run();

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ message: 'Unable to retrieve user state' });
  });

  it('should register /api/user-state before a generic /api proxy', async () => {
    const userState = {
      cache_name: cacheKey,
      domains: {
        fines: {
          business_unit_users: [],
        },
      },
    };
    const harness = createRouteHarness();

    harness.app.use('/api', (() => undefined) as RouteHandler);

    axiosGetMock.mockResolvedValue({ data: userState, status: 200 });

    const response = await harness.run();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(userState);
    expect(response.body).not.toEqual({ proxied: true });
    expect(harness.registrations.map(({ method, path }) => ({ method, path }))).toEqual([
      { method: 'get', path: '/api/user-state' },
      { method: 'use', path: '/api' },
    ]);
  });

  it('should use the configured user service URL and path', async () => {
    axiosGetMock.mockResolvedValue({ data: {}, status: 200 });

    await createRouteHarness().run();

    expect(configGetMock).toHaveBeenCalledWith('opal-api.opal-user-service');
    expect(configGetMock).toHaveBeenCalledWith('opal-user-service-urls.userStateUrl');
  });
});

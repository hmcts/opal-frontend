import { describe, expect, it } from 'vitest';
import { getOpalUserServiceConfiguration } from './get-opal-user-service-configuration.util';

describe('getOpalUserServiceConfiguration', () => {
  it('maps the user service endpoint, timeout, and retry config values', () => {
    const values: Record<string, number | string> = {
      'opal-user-service-urls.userStateUrl': '/v2/users/0/state',
      'opal-user-service-urls.addUserUrl': '/users',
      'opal-user-service-urls.updateUserUrl': '/users',
      'opal-user-service.timeoutInMilliseconds': 5000,
      'opal-user-service.retryAttempts': 3,
      'opal-user-service.retryDelayInMilliseconds': 200,
    };

    const configuration = {
      get: <T>(property: string): T => values[property] as T,
    };

    expect(getOpalUserServiceConfiguration(configuration)).toEqual({
      userStateUrl: '/v2/users/0/state',
      addUserUrl: '/users',
      updateUserUrl: '/users',
      timeoutInMilliseconds: 5000,
      retryAttempts: 3,
      retryDelayInMilliseconds: 200,
    });
  });
});

import type config from 'config';
import { OpalUserServiceConfiguration } from '@hmcts/opal-frontend-common-node/interfaces';

export const getOpalUserServiceConfiguration = (
  configuration: Pick<typeof config, 'get'>,
): OpalUserServiceConfiguration => ({
  userStateUrl: configuration.get('opal-user-service-urls.userStateUrl'),
  addUserUrl: configuration.get('opal-user-service-urls.addUserUrl'),
  updateUserUrl: configuration.get('opal-user-service-urls.updateUserUrl'),
  // TODO: Confirm the initial operational defaults for timeout and bounded retry with the owning team.
  timeoutInMilliseconds: configuration.get('opal-user-service.timeoutInMilliseconds'),
  retryAttempts: configuration.get('opal-user-service.retryAttempts'),
  retryDelayInMilliseconds: configuration.get('opal-user-service.retryDelayInMilliseconds'),
});

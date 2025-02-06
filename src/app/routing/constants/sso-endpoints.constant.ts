import { ISsoEndpoints } from '@routing/interfaces/sso-endpoints.interface';

export const SSO_ENDPOINTS: ISsoEndpoints = {
  login: '/sso/login',
  logout: '/sso/logout',
  callback: '/sso/callback',
  authenticated: '/sso/authenticated',
};

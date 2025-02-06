import { IPagesRoutingPaths } from '@routing/pages/interfaces/routing-paths.interface';

export const PAGES_ROUTING_PATHS: IPagesRoutingPaths = {
  root: '',
  children: {
    accessDenied: 'access-denied',
    signIn: 'sign-in',
    signInStub: 'sign-in-stub',
    dashboard: 'dashboard',
  },
};

import { SecurityToken } from './classes/index';

declare module 'express-session' {
  interface SessionData {
    securityToken: SecurityToken | undefined;
  }
}

export {};

import { SecurityToken } from './interfaces/index';

declare module 'express-session' {
  interface SessionData {
    securityToken: SecurityToken | undefined;
  }
}

export {};

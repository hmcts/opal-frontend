import { SecurityToken, UserState } from './interfaces/index';

declare module 'express-session' {
  interface SessionData {
    userState: UserState | undefined;
    securityToken: SecurityToken | undefined;
  }
}

export {};

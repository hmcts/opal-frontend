import { SecurityToken, UserState } from './interfaces/index';

declare module 'express-session' {
  interface SessionData {
    user_state: UserState | undefined;
    securityToken: SecurityToken | undefined;
  }
}

export {};

import UserState from './userState';

class SecurityToken {
  userState: UserState | undefined;
  accessToken!: string;
}

export default SecurityToken;

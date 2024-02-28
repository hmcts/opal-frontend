// import UserState from './userState';

import UserState from "./userState";

class SecurityToken {
  //   userState: UserState | undefined;
  accessToken!: string;
  userState?: UserState;
}

export default SecurityToken;

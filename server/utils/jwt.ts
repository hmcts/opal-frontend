import { DateTime } from 'luxon';
export class Jwt {
  //Returns payload of JWT
  static parseJwt(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }

  //If token doesn't exist, or is expired, return as invalid
  static isJwtExpired(token: string | undefined) {
    try {
      if (token) {
        const payload = this.parseJwt(token);

        if (payload.exp) {
          //Create date from expiry, argument must be in ms so multiply by 1000

          const jwtExpiry = DateTime.fromMillis(payload.exp * 1000).toISO();
          const currentDateTime = DateTime.now().toISO();

          if (!jwtExpiry) {
            return true;
          }

          //If JWT expiry is after now, then return as valid
          if (jwtExpiry > currentDateTime) {
            return false;
          }
        }
      }
      return true;
    } catch {
      return true;
    }
  }
}

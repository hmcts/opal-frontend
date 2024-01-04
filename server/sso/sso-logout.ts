import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import config from 'config';

const INTERNAL_USER_LOGOUT = `${config.get('opal-api.url')}/internal-user/logout`;

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken;

    if (req.session.securityToken) {
      accessToken = req.session.securityToken.accessToken;
    }
    console.log('accessToken', accessToken);

    if (!accessToken) {
      next(new Error('No access token found in session'));
    }

    const response = await axios.get(INTERNAL_USER_LOGOUT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // For now to test session creation
    if (response) {
      res.redirect('/sso/logout-callback');
    }
  } catch (error) {
    console.log('Error logging out', error);
    next(new Error('Error logging out'));
  }
};

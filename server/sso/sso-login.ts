import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import config from 'config';

const INTERNAL_USER_LOGIN = `${config.get('opal-api.url')}/internal-user/login-or-refresh`;

export default async (req: Request, res: Response, next: NextFunction) => {
  res.redirect(INTERNAL_USER_LOGIN);

  // const url = 'http://localhost:4550/internal-user/login-or-refresh';

  // try {
  //   const response = await axios.get(url);
  //   // console.log(response.data.res);
  //   // For now to test session creation
  //   if (url) {
  //     res.redirect(INTERNAL_USER_LOGIN);
  //   }
  // } catch (error) {
  //   next(new Error('Error trying to fetch login page'));
  // }
};

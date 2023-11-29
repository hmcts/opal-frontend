import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1';

  try {
    const response = await axios.get(url);

    // For now to test session creation
    if (response) {
      res.redirect('/sso/logout-callback');
    }
  } catch (error) {
    next(new Error('Error trying to fetch login page'));
  }
};

import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

export default async (req: Request, res: Response, next: NextFunction) => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1';

  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    next(new Error('Error trying to fetch login page'));
  }
};

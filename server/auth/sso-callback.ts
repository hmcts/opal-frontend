import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  res.send('Hello from the callback');
};

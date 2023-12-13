import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    setTimeout(() => {
      res.redirect('/');
    }, 500);
  });
};

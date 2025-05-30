import { Request, Response, NextFunction } from "express";

export default {
  loggerMiddleware: (req: Request, res: Response, next: NextFunction) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );
    next();
  },
};

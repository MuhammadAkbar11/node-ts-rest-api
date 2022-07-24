import { Request, Response, NextFunction } from "express";

function requiredUser(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).json({
      message: "Not authorized!",
    });
  }

  return next();
}

export default requiredUser;

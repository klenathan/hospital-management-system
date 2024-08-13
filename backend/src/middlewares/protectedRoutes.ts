import { Request, Response, NextFunction } from "express";

const protectedRouteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authString = req.get("x-auth-string");
  if (!authString) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }
  const authStrSplit = authString.split(":");
  res.locals.user = authStrSplit[0];
  res.locals.pwd = authStrSplit[1];
  next();
};

export default protectedRouteMiddleware;

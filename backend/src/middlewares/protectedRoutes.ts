import { Request, Response, NextFunction } from "express";
// import { decrypt, encrypt } from "../utils/encryption";

const protectedRouteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const en = await encrypt("root:root");
  // const decrypted = await decrypt(en);
  // console.log(decrypted);

  const authString = req.get("x-auth-string");

  if (!authString) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }

  const authStringSplited = authString.split(":");

  if (authStringSplited.length != 2) {
    return res.status(401).json({ message: "INVALID HEADER: `x-auth-string`" });
  }

  res.locals["username"] = authStringSplited[0];
  res.locals["password"] = authStringSplited[1];
  next();
};

export default protectedRouteMiddleware;

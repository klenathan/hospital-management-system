import { Request, Response, Router } from "express";
const reportRouter = Router();

reportRouter.get("/", (_: Request, res: Response) => {
  return res.send({ message: "GET reports" });
});

export default reportRouter;

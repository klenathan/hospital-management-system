import { Request, Response, Router } from "express";
const reportRouter = Router();

reportRouter.get("/", (_: Request, res: Response) => {
  // #swagger.summary = 'Get reports'

  return res.send({ message: "GET reports" });
});

export default reportRouter;

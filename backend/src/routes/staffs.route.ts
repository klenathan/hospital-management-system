import { Request, Response, Router } from "express";
const staffRouter = Router();

staffRouter.get("/", (_: Request, res: Response) => {
  // #swagger.summary = 'Get staffs info'
  return res.send({ message: "GET staffs" });
});

export default staffRouter;

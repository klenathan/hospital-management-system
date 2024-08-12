import { Request, Response, Router } from "express";
const staffRouter = Router();

staffRouter.get("/", (_: Request, res: Response) => {
  return res.send({ message: "GET staffs" });
});

export default staffRouter;

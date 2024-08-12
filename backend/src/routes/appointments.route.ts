import { Request, Response, Router } from "express";
const appointmentRouter = Router();

appointmentRouter.get("/", (_: Request, res: Response) => {
  return res.send({ message: "GET appointments" });
});

export default appointmentRouter;

import { Request, Response, Router } from "express";
const patientRouter = Router();

patientRouter.get("/", (_: Request, res: Response) => {
  return res.send({ message: "GET patients" });
});

export default patientRouter;

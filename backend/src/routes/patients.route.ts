import { Request, Response, Router } from "express";
const patientRouter = Router();

patientRouter.get("/", (_: Request, res: Response) => {
  // #swagger.summary = 'Get patiends info'
  return res.send({ message: "GET patients" });
});

patientRouter.post("/", (_: Request, res: Response) => {
  // #swagger.summary = 'Create new patients'
  return res.send({ message: "GET patients" });
});

patientRouter.put("/:id", (_: Request, res: Response) => {
  // #swagger.summary = 'Update Patient info'
  return res.send({ message: "GET patients" });
});

patientRouter.delete("/:id", (_: Request, res: Response) => {
  // #swagger.summary = '(Soft) Delete patient info'
  return res.send({ message: "GET patients" });
});

export default patientRouter;

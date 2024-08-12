import { Request, Response, Router } from "express";
import PatientService from "../services/patients.service";

const patientRouter = Router();

const patientService = new PatientService();

patientRouter.get(
  "/",

  async (_: Request, res: Response) => {
    try {
      const patients = await patientService.getAllPatients();

      return res.json(patients);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);
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

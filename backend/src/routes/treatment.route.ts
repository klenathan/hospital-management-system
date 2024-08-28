import { Request, Response, Router } from "express";
import { dbConfigBuilder } from "../db/mysql";
import PatientService from "../services/patients.service";

const treatmentRouter = Router();

const patientService = new PatientService();

treatmentRouter.get("/:patientId", async (req: Request, res: Response) => {
  // #swagger.summary = "Get treatment by patientID"

  // #swagger.parameters['patientId'] = { description: 'Patient ID' }
  try {
    const patientId = parseInt(req.params["patientId"] as string);
    if (isNaN(patientId)) {
      throw new Error("Invalid patient ID: patientId");
    }

    const result = await patientService.getAllTreatmentByPatientId(
      patientId,
      dbConfigBuilder(res.locals["username"], res.locals["password"])
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: (error as Error).message });
  }
});

export default treatmentRouter;

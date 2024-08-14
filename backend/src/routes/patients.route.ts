import { Request, Response, Router } from "express";
import PatientService from "../services/patients.service";

const patientRouter = Router();

const patientService = new PatientService();

patientRouter.get("/", async (_: Request, res: Response) => {
  try {
    const patients = await patientService.getAllPatients();

    return res.json(patients);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
patientRouter.post("/", (_: Request, res: Response) => {
  // #swagger.summary = 'Create new patients'
  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new user.',
            schema: {
                $first_name: 'Van A',
                $last_name: 'Nguyen',
                $date_of_birth: '01-01-2000',
                $contact_info: '0912789JQK',
                $address: 'Nguyen Van Linh',
                $allergies: 'peanut'
            }
    } */
  return res.json({ message: "GET patients" }).status(200);
});

patientRouter.put("/:id", (_: Request, res: Response) => {
  // #swagger.summary = 'Update Patient info'
  // #swagger.parameters['id'] = { description: 'Patient ID' }
  return res.json({ message: "GET patients" }).status(200);
});

patientRouter.delete("/:id", (_: Request, res: Response) => {
  // #swagger.summary = '(Soft) Delete patient info'
  // #swagger.parameters['id'] = { description: 'Patient ID' }
  return res.json({ message: "GET patients" }).status(200);
});

export default patientRouter;

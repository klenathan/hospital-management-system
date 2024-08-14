import { Request, Response, Router } from "express";
import PatientService from "../services/patients.service";

const patientRouter = Router();

const patientService = new PatientService();

patientRouter.get("/", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Get all patients'
  
  #swagger.parameters['order'] = {
            in: 'query',
            description: 'Query order',
    } */
  try {
    const order = req.query["order"];

    if (order) {
      if (order != "asc" && order != "desc") {
        throw new Error("INVALID ORDER");
      }
    }
    const patients = await patientService.getAllPatients({
      order: order as "asc" | "desc",
    });
    return res.send(patients);
  } catch (e) {
    res.json({ error: (e as Error).message }).status(500);
  }
});

patientRouter.get("/id/:id", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Search patient by ID'
  
  #swagger.parameters['id'] = { description: 'Patient ID' }*/
  try {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) {
      throw new Error("Invalid patient ID: id");
    }

    const patients = await patientService.getPatientByID({
      id,
    });
    return res.send(patients);
  } catch (e) {
    res.json({ error: (e as Error).message }).status(500);
  }
});

patientRouter.get("/name/:name", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Search patients by name'
  
  #swagger.parameters['name'] = { description: 'Patient name (will search lastname and firstname)' }*/
  try {
    const name = req.params["name"] as string;

    if (!name) {
      throw new Error("Missing `Name` param");
    }

    const patients = await patientService.getPatientByName({
      name,
    });
    return res.send(patients);
  } catch (e) {
    res.json({ error: (e as Error).message }).status(500);
  }
});

patientRouter.post("/", (_: Request, res: Response) => {
  // #swagger.summary = 'Create new patients'
  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new patients.',
            schema: {
                $first_name: 'Van A',
                $last_name: 'Nguyen',
                $date_of_birth: '01-01-2000',
                $contact_info: '0912789JQK',
                $address: 'Nguyen Van Linh',
                $allergies: 'peanut'
            }
    } */
  return res.json({ message: "POST patients" }).status(200);
});

patientRouter.put("/:id", (_: Request, res: Response) => {
  // #swagger.summary = 'Update Patient info'
  // #swagger.parameters['id'] = { description: 'Patient ID' }
  return res.json({ message: "PUT patients" }).status(200);
});

patientRouter.delete("/:id", (_: Request, res: Response) => {
  // #swagger.summary = '(Soft) Delete patient info'
  // #swagger.parameters['id'] = { description: 'Patient ID' }
  return res.json({ message: "DELETE patients" }).status(200);
});

export default patientRouter;

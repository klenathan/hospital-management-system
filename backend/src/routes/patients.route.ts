import { Request, Response, Router } from "express";
import PatientService from "../services/patients.service";
import { z } from "zod";

import { dbConfigBuilder } from "../db/mysql";

const NewTreatmentDTO = z.object({
  patientId: z.number(),
  staffId: z.number(),
  treatmentDate: z.coerce.date(),
  treatmentDetail: z.string().optional(),
});

const UpdatePatientDTO = z.object({
  first_name: z.string(),
  last_name: z.string(),
  date_of_birth: z.string(),
  contact_info: z.string(),
  address: z.string(),
  allergies: z.string().optional(),
});

const patientRouter = Router();

const patientService = new PatientService();

patientRouter.get("/", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Get all patients'
  
  #swagger.parameters['order'] = {
            in: 'query',
            description: 'Query order',
    } 
    #swagger.parameters['pageSize'] = {
        in: 'query',
        description: 'Query pageSize',
    } 
   #swagger.parameters['pageNumber'] = {
            in: 'query',
            description: 'Query page Number',
    } 

    */
  try {
    let order = req.query["order"];
    let pageSize = parseInt(req.query["pageSize"] as string);
    let pageNumber = parseInt(req.query["pageNumber"] as string);

    if (order) {
      if (order != "asc" && order != "desc") {
        throw new Error("INVALID ORDER");
      }
    } else {
      order = "asc";
    }

    if (!pageSize) {
      pageSize = 200;
    }

    if (!pageNumber) {
      pageNumber = 1;
    }
    const patients = await patientService.getAllPatients(
      {
        order: order as "asc" | "desc",
        pageNumber: pageNumber,
        pageSize: pageSize,
      },
      dbConfigBuilder(res.locals["username"], res.locals["password"])
    );
    return res.status(200).send(patients);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
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

    const patients = await patientService.getPatientByID(
      {
        id,
      },
      dbConfigBuilder(res.locals["username"], res.locals["password"])
    );
    return res.status(200).send(patients);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
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

    const data = await patientService.getPatientByName(
      {
        name,
      },
      dbConfigBuilder(res.locals["username"], res.locals["password"])
    );
    return res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

patientRouter.post("/", async (req: Request, res: Response) => {
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
                allergies: 'peanut'
            }
    } */
  try {
    const body = req.body;
    const dobParsed = new Date(body.date_of_birth).toISOString().split("T")[0];

    const result = await patientService.createNewPatient(
      {
        firstName: body.first_name,
        lastName: body.last_name,
        dob: dobParsed,
        contactInfo: body.contact_info,
        address: body.address,
        allergies: body.allergies,
      },
      dbConfigBuilder(res.locals["username"], res.locals["password"])
    );
    return res.status(200).send(result);
  } catch (e) {
    return res.status(400).json({ error: (e as Error).message });
  }
});

patientRouter.post("/treatment", async (req: Request, res: Response) => {
  // #swagger.summary = 'Create new patients'

  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new patients.',
            schema: {
                $patientId: 1,
                $staffId: 1,
                $treatmentDate: "10-08-2024",
                treatmentDetail: "Testing"
            }
    } */
  try {
    const createNewTreatment = NewTreatmentDTO.parse(req.body);

    const result = await patientService.createNewTreatment(
      createNewTreatment,
      dbConfigBuilder(res.locals["username"], res.locals["password"])
    );
    return res.status(200).send(result);
  } catch (e) {
    return res.status(400).json({ error: (e as Error).message });
  }
});

patientRouter.put("/:id", async (req: Request, res: Response) => {
  // #swagger.summary = 'Update Patient info'
  // #swagger.parameters['id'] = { description: 'Patient ID' }

  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new patients.',
            schema: {
                $first_name: 'Van A',
                $last_name: 'Nguyen',
                $date_of_birth: '01-01-2000',
                $contact_info: '0912789JQK',
                $address: 'Nguyen Van Linh',
                allergies: 'peanut'
            }
    } */
  let updateProps = UpdatePatientDTO.parse(req.body);
  const id = req.params["id"];

  const dobParsed = new Date(updateProps.date_of_birth)
    .toISOString()
    .split("T")[0];

  if (!id) {
    return res.status(400).json({ error: "INVALID ID" });
  }

  const result = await patientService.updatePatientInfo(
    { ...updateProps, id: req.params["id"], date_of_birth: dobParsed },
    dbConfigBuilder(res.locals["username"], res.locals["password"])
  );
  return res.json(result).status(200);
});

patientRouter.delete("/:id", (_: Request, res: Response) => {
  // #swagger.summary = '(Soft) Delete patient info'
  // #swagger.parameters['id'] = { description: 'Patient ID' }

  return res.json({ message: "DELETE patients" }).status(200);
});

export default patientRouter;

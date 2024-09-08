import { Request, Response, Router } from "express";
import ReportService from "../services/report.service";

import { dbConfigBuilder } from "../db/mysql";

const reportRouter = Router();

const reportService = new ReportService();

reportRouter.get(
  "/patientTreatmentHistory",
  async (req: Request, res: Response) => {
    /*  
  #swagger.summary = "View a patient treatment history for a given duration & View all patient treatment in a given duration"
  
  #swagger.parameters['patientId'] = {
            in: 'query',
            description: 'Query Staff ID (INT)',
    } 

 #swagger.parameters['startTime'] = {
            in: 'query',
            description: 'Query start time',
            default: '2024-08-11'
    } 
            
  #swagger.parameters['endTime'] = {
        in: 'query',
        description: 'Query end time',
        default: '2024-08-12'
    } */
    try {
      let patientId;

      if (req.query["patientId"]) {
        patientId = parseInt(req.query["patientId"] as string);
        if (isNaN(patientId)) {
          throw new Error("Invalid Query: patientId");
        }
      }

      const startTime = req.query["startTime"] as string;
      const endTime = req.query["endTime"] as string;

      const appointments = await reportService.getPatientTreatments(
        patientId,
        startTime,
        endTime,
        dbConfigBuilder(res.locals["username"], res.locals["password"])
      );
      return res.status(200).send(appointments);
    } catch (e) {
      return res.status(400).json({ error: (e as Error).message });
    }
  }
);

reportRouter.get(
  "/jobHistory/:staffId",
  async (req: Request, res: Response) => {
    /*  
  #swagger.summary = 'View job change history of a staff'
  
  #swagger.parameters['staffId'] = { description: 'Staff ID' }*/
    try {
      const staffId = parseInt(req.params["staffId"] as string);
      if (isNaN(staffId)) {
        throw new Error("Invalid staff ID: staffId");
      }
      const staffs = await reportService.getStaffHistory(
        {
          staffId,
        },
        dbConfigBuilder(res.locals["username"], res.locals["password"])
      );
      return res.status(200).send(staffs);
    } catch (e) {
      return res.status(400).json({ error: (e as Error).message });
    }
  }
);

reportRouter.get("/jobHistory", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'View job change history'
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

    const staffs = await reportService.getAllStaffHistory(
      {
        order: order as "asc" | "desc",
        pageNumber: pageNumber,
        pageSize: pageSize,
      },
      dbConfigBuilder(res.locals["username"], res.locals["password"])
    );
    return res.status(200).send(staffs);
  } catch (e) {
    return res.status(400).json({ error: (e as Error).message });
  }
});

reportRouter.get("/doctorWorkHistory", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = "View the work of a doctor in a given duration & View the work of all doctors in a given duratio"
  
  #swagger.parameters['staffId'] = {
            in: 'query',
            description: 'Query Staff ID (INT)',
    } 

 #swagger.parameters['startTime'] = {
            in: 'query',
            description: 'Query start time',
            default: '2024-08-11'
    } 
            
  #swagger.parameters['endTime'] = {
        in: 'query',
        description: 'Query end time',
        default: '2024-08-12'
    } */
  try {
    let staffId;

    if (req.query["staffId"]) {
      staffId = parseInt(req.query["staffId"] as string);
      if (isNaN(staffId)) {
        throw new Error("Invalid Query: staffId");
      }
    }

    const startTime = req.query["startTime"] as string;
    const endTime = req.query["endTime"] as string;

    const appointments = await reportService.getDoctorWork(
      staffId,
      startTime,
      endTime,
      dbConfigBuilder(res.locals["username"], res.locals["password"])
    );
    return res.status(200).send(appointments);
  } catch (e) {
    return res.status(400).json({ error: (e as Error).message });
  }
});

export default reportRouter;

import { Request, Response, Router } from "express";
import StaffService from "../services/staff.service";
const staffRouter = Router();

const staffService = new StaffService();

staffRouter.get("/", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Get all staffs'
  
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
    const staffs = await staffService.getAllStaffs({
      order: order as "asc" | "desc",
    });
    res.send(staffs);
  } catch (e) {
    res.json({ error: (e as Error).message }).status(400);
  }
});

staffRouter.get("/department/:depId", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Get all staffs by department ID'
  
  #swagger.parameters['depId'] = { description: 'Department ID' }*/
  try {
    const depId = parseInt(req.params["depId"] as string);
    if (isNaN(depId)) {
      throw new Error("Invalid department ID: depId");
    }
    const staffs = await staffService.listStaffByDep({
      depId,
    });
    res.send(staffs);
  } catch (e) {
    res.json({ error: (e as Error).message }).status(400);
  }
});

staffRouter.get("/schedule/:staffId", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Get a staff's schedule'
  
  #swagger.parameters['staffId'] = { description: 'Staff ID' }*/
  try {
    const staffId = parseInt(req.params["staffId"] as string);
    if (isNaN(staffId)) {
      throw new Error("Invalid staff ID: staffId");
    }
    const staffs = await staffService.getStaffSchedule({
      staffId,
    });
    res.send(staffs);
  } catch (e) {
    res.json({ error: (e as Error).message }).status(400);
  }
});

export default staffRouter;

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

staffRouter.get("/department/:dep", async (req: Request, res: Response) => {
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

export default staffRouter;

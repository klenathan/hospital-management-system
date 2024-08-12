import { Request, Response, Router } from "express";
import StaffService from "../services/staff.service";
const staffRouter = Router();

const staffService = new StaffService();

staffRouter.get("/", async (_: Request, res: Response) => {
  // #swagger.summary = 'Get staffs info'

  const staffs = await staffService.getAllStaffs();
  return res.send(staffs);
});

export default staffRouter;

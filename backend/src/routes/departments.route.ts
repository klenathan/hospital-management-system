import { Request, Response, Router } from "express";
import DepartmentService from "../services/department.service";

import { dbConfigBuilder } from "../db/mysql";
const departmentRouter = Router();

const service = new DepartmentService();
departmentRouter.get("/", async (_: Request, res: Response) => {
  // #swagger.summary = "Get all department"
  try {
    const reult = await service.getAllDepartments(
      dbConfigBuilder(res.locals["username"], res.locals["password"])
    );
    return res.status(200).json(reult);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "internal server error" });
  }
});

export default departmentRouter;

import { Request, Response, Router } from "express";
import StaffService from "../services/staff.service";
import { z } from "zod";

const NewStaffDTO = z.object({
  firstName: z.string(),
  lastName: z.string(),
  jobType: z.string(),
  qualification: z.string(),
  deptId: z.number(),
  salary: z.number(),
});

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
    return res.status(200).send(staffs);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: (e as Error).message });
  }
});

staffRouter.post("/", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Create new staff (with new user to system)'
  
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new staff body.',
            schema: {
                $firstName: "Super",
                $lastName: "Saiyan",
                $jobType: "Doctor",
                $qualification: "MD",
                $deptId: 1,
                $salary: 100000000
            }
    } */
  try {
    // const staffId = parseInt(req.params["staffId"] as string);
    // if (isNaN(staffId)) {
    //   throw new Error("Invalid staff ID: staffId");
    // }

    const newStaffProps = NewStaffDTO.parse(req.body);

    const staffs = await staffService.createSingleNewStaff(newStaffProps);
    return res.status(200).send(staffs);
  } catch (error) {
    if (error instanceof z.ZodError) {
      for (const issue of error.issues) {
        console.error("Validation failed: ", issue);
      }
      return res.status(400).json({
        message: `Validation error: ${error.issues
          .map((e) => e.path)
          .join("; ")}`,
      });
    } else {
      console.error("Error: ", error);
      return res.status(400).json({
        message: `Validation error: ${error}`,
      });
    }
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
    return res.status(200).send(staffs);
  } catch (e) {
    return res.status(400).json({ error: (e as Error).message });
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
    return res.status(200).send(staffs);
  } catch (e) {
    return res.status(400).json({ error: (e as Error).message });
  }
});

export default staffRouter;

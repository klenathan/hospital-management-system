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

const UpdateStaffScheduleDTO = z.object({
  // staffId: z.number(),
  appointmentId: z.number(),
  newStartTime: z.coerce.date(),
  newEndTime: z.coerce.date(),
});

const staffRouter = Router();

const staffService = new StaffService();

staffRouter.get("/", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'List the staff by name (in ASC and DESC order)'
  
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
  #swagger.summary = 'Add a new staff'
  
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
        message: `Server error: ${error}`,
      });
    }
  }
});

staffRouter.get("/department/:depId", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'List the staff by department'
  
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

staffRouter.put("/schedule/:staffId", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Update a staff's schedule'
  
  #swagger.parameters['staffId'] = { description: 'Staff ID' }
  
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update staff schedule body.',
            schema: {
                $appointmentId: 1,
                $newStartTime: "2024-08-10T06:00:00.000Z",
                $newEndTime: "2024-08-11T06:10:00.000Z",
            }
    } 
  */
  try {
    const staffId = parseInt(req.params["staffId"] as string);
    if (isNaN(staffId)) {
      throw new Error("Invalid staff ID: staffId");
    }

    const params = UpdateStaffScheduleDTO.parse(req.body);

    const staffs = await staffService.updateStaffSchedule(staffId, params);
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
        message: `Server error: ${error}`,
      });
    }
  }
});

export default staffRouter;

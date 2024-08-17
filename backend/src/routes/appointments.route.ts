import { Request, Response, Router } from "express";
import AppointmentService from "../services/appointments.service";

import { z } from "zod";

const CreateNewAppointment = z.object({
  patientId: z.number(),
  staffId: z.number(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  purpose: z.string(),
});

const appointmentRouter = Router();

const appointmentService = new AppointmentService();

appointmentRouter.get("/", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = "Get all appointments"
  
  #swagger.parameters['staffId'] = {
            in: 'query',
            description: 'Query Staff ID (INT)',
    } */
  try {
    let staffId;

    if (req.query["staffId"]) {
      staffId = parseInt(req.query["staffId"] as string);
      if (isNaN(staffId)) {
        throw new Error("Invalid Query: staffId");
      }
    }
    const appointments = await appointmentService.getAllAppointments(staffId);
    res.status(200).send(appointments);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

appointmentRouter.get("/schedule", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = "View working schedule of all doctors for a given duration (with busy or available status)"
  
  #swagger.parameters['startTime'] = {
            in: 'query',
            description: 'Query start time',
            default: '2024-08-11 12:00:00'
    } 
            
  #swagger.parameters['endTime'] = {
        in: 'query',
        description: 'Query end time',
        default: '2024-08-12 12:30:00'
    } */
  try {
    const startTime = req.query["startTime"] as string;
    const endTime = req.query["endTime"] as string;
    const appointments = await appointmentService.getAllDoctorSchedule(
      startTime,
      endTime
    );
    res.status(200).send(appointments);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

appointmentRouter.post("/", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Create new appointment with doctor'
  
  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new staff body.',
            schema: {
                $patientId: 1,
                $staffId: 1,
                $startTime: "2024-08-10T06:00:00.000Z",
                $endTime: "2024-08-10T06:40:00.000Z",
                $purpose: "Checkups",
            }
    } */
  try {
    // const staffId = parseInt(req.params["staffId"] as string);
    // if (isNaN(staffId)) {
    //   throw new Error("Invalid staff ID: staffId");
    // }

    const newAppointmentProps = CreateNewAppointment.parse(req.body);

    const staffs = await appointmentService.createNewAppointment(
      newAppointmentProps
    );
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

appointmentRouter.delete("/:id", async (req: Request, res: Response) => {
  /*  
  #swagger.summary = 'Cancel appointment with doctor'

  #swagger.parameters['id'] = { description: 'Appointment ID' }
  */
  try {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) {
      throw new Error("Invalid patient ID: id");
    }

    const staffs = await appointmentService.cancelAppointment(id);
    return res.status(200).send(staffs);
  } catch (error) {
    console.error("Error: ", error);
    return res.status(400).json({
      message: `Server error: ${error}`,
    });
  }
});

export default appointmentRouter;

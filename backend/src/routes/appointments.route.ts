import { Request, Response, Router } from "express";
import AppointmentService from "../services/appointments.service";
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

export default appointmentRouter;

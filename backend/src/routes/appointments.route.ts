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
    res.send(appointments);
  } catch (e) {
    res.json({ error: (e as Error).message }).status(400);
  }
});

export default appointmentRouter;

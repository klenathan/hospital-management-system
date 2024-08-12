import { Request, Response, Router } from "express";
import AppointmentService from "../services/appointments.service";
const appointmentRouter = Router();

const appointmentService = new AppointmentService();
appointmentRouter.get("/", async (_: Request, res: Response) => {
  try {
    const appoinemtns = await appointmentService.getAllAppointments();
    return res.send(appoinemtns);
  } catch (error) {
    console.log(error);

    return res.send(500);
  }
});

export default appointmentRouter;

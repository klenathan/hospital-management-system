import { Router } from "express";
import appointmentRouter from "./appointments.route";
import patientRouter from "./patients.route";
import reportRouter from "./reports.route";
import staffRouter from "./staffs.route";

const router = Router();

router.use("/patient", patientRouter);

router.use("/staff", staffRouter);

router.use("/appointment", appointmentRouter);

router.use("/report", reportRouter);

export default router;

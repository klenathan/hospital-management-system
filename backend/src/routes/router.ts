import { Router } from "express";
import appointmentRouter from "./appointments.route";
import patientRouter from "./patients.route";
import reportRouter from "./reports.route";
import staffRouter from "./staffs.route";

const router = Router();

router.use(
  "/patient",
  patientRouter
  /* 
    #swagger.tags = ['Patients']

    #swagger.security = [{
        "apiKeyAuth": []
    }] 

    #swagger.responses[500] = {
        schema: { $ref: '#/definitions/serverErrSchema' }
    }  

    #swagger.responses[400] = {
        schema: { $ref: '#/definitions/errSchema' }
    } 
    */
);

router.use("/staff", staffRouter);

router.use("/appointment", appointmentRouter);

router.use("/report", reportRouter);

export default router;

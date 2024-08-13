import { Router } from "express";
import appointmentRouter from "./appointments.route";
import patientRouter from "./patients.route";
import reportRouter from "./reports.route";
import staffRouter from "./staffs.route";
import authRouter from "./auth.route";

const router = Router();

router.use(
  "/auth",
  authRouter
  /* 
    #swagger.tags = ['Auth']

    #swagger.responses[500] = {
        schema: { $ref: '#/definitions/serverErrSchema' }
    }  

    #swagger.responses[400] = {
        schema: { $ref: '#/definitions/errSchema' }
    }
    */
);
router.use(
  "/patient",
  patientRouter
  /* 
    #swagger.tags = ['Patients']

    #swagger.responses[500] = {
        schema: { $ref: '#/definitions/serverErrSchema' }
    }  

    #swagger.responses[400] = {
        schema: { $ref: '#/definitions/errSchema' }
    }
    */
);

router.use(
  "/staff",
  staffRouter /**
    #swagger.tags = ['Staff']
    */
);

router.use(
  "/appointment",
  appointmentRouter /**
    #swagger.tags = ['Appointments']
    */
);

router.use(
  "/report",
  reportRouter /**
    #swagger.tags = ['Report']
    */
);

export default router;

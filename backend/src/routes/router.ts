import { Router } from "express";
import appointmentRouter from "./appointments.route";
import patientRouter from "./patients.route";
import reportRouter from "./reports.route";
import staffRouter from "./staffs.route";
import authRouter from "./auth.route";
import treatmentRouter from "./treatments.route";
import departmentRouter from "./departments.route";
import protectedRouteMiddleware from "../middlewares/protectedRoutes";
import blobRouter from "./blobs.route";

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
  "/blob",
  protectedRouteMiddleware,
  blobRouter
  /* 
    #swagger.tags = ['Blobs']

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
  protectedRouteMiddleware,
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
  protectedRouteMiddleware,
  staffRouter /**
    #swagger.tags = ['Staff']
    */
);
router.use(
  "/department",
  protectedRouteMiddleware,
  departmentRouter /**
    #swagger.tags = ['Department']
    */
);

router.use(
  "/appointment",
  protectedRouteMiddleware,
  appointmentRouter /**
    #swagger.tags = ['Appointments']
    */
);

router.use(
  "/treatment",
  protectedRouteMiddleware,
  treatmentRouter /**
    #swagger.tags = ['Treatments']
    */
);

router.use(
  "/report",
  protectedRouteMiddleware,
  reportRouter /**
    #swagger.tags = ['Report']
    */
);

export default router;

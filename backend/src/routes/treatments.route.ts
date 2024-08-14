import { Request, Response, Router } from "express";
import TreatmentService from "../services/treatments.service";
const treatmentRouter = Router();

const treatmentService = new TreatmentService();
treatmentRouter.get("/", async (_: Request, res: Response) => {
  // #swagger.summary = "Get all treatments"
  try {
    const appoinemtns = await treatmentService.getAllTreatments();
    return res.send(appoinemtns);
  } catch (error) {
    console.log(error);

    return res.send(500);
  }
});

export default treatmentRouter;

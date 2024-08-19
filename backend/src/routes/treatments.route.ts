import { Request, Response, Router } from "express";
import TreatmentService from "../services/treatments.service";
const treatmentRouter = Router();

const treatmentService = new TreatmentService();
treatmentRouter.get("/", async (_: Request, res: Response) => {
  // #swagger.summary = "Get all treatments"
  try {
    const appoinemtns = await treatmentService.getAllTreatments();
    return res.status(200).send(appoinemtns);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

export default treatmentRouter;

import { Request, Response, Router } from "express";

const authRouter = Router();

authRouter.get("/publicToken", async (_: Request, res: Response) => {
  // #swagger.summary = "Get auth public key"
  try {
    return res.status(200).json({ publicToken: "" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "internal server error" });
  }
});

export default authRouter;

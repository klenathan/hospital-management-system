import { Request, Response, Router } from "express";
import { promises as fs } from "fs";
import path from "path";

const authRouter = Router();

authRouter.get("/publicToken", async (_: Request, res: Response) => {
  // #swagger.summary = "Get auth public key"

  const file = await fs.readFile(
    path.join(__dirname, "../../key/public_key.pem")
  );

  try {
    return res.status(200).json({ publicToken: Buffer.from(file).toString() });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "internal server error" });
  }
});

export default authRouter;

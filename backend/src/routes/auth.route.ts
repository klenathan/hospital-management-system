import { Request, Response, Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { dbConfigBuilder, getMySqlConnnection } from "../db/mysql";
import { z } from "zod";
import { RowDataPacket } from "mysql2/promise";

const authRouter = Router();

authRouter.get("/publicToken", async (_: Request, res: Response) => {
  // #swagger.summary = "Get auth public key"
  // #swagger.deprecated = true

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

const LoginRequestDTO = z.object({
  username: z.string(),
  password: z.string(),
});

authRouter.post("/login", async (req: Request, res: Response) => {
  // #swagger.summary = "Login"

  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Login param',
            schema: {
                $username: 'SuperSaiyan200',
                $password: 'password'
            }
    } */

  try {
    const loginObj = LoginRequestDTO.parse(req.body);

    const dbConfig = dbConfigBuilder(
      loginObj["username"],
      loginObj["password"]
    );
    const conn = await getMySqlConnnection(dbConfig);

    const [rows, _fields] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM staffs 
      WHERE username=? LIMIT 1`,
      [loginObj.username]
    );

    console.log(rows);

    return res.status(200).json(loginObj);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "internal server error" });
  }
});

export default authRouter;

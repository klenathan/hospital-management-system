import { Request, Response, Router } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import { z } from 'zod';
import { dbConfigBuilder, getMySqlConnnection } from '../db/mysql';

const authRouter = Router();

const LoginRequestDTO = z.object({
  username: z.string(),
  password: z.string(),
});

authRouter.post('/login', async (req: Request, res: Response) => {
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
      loginObj['username'],
      loginObj['password']
    );
    const conn = await getMySqlConnnection(dbConfig);

    const [rows, _fields] = await conn.query<RowDataPacket[]>(
      `CALL S_GetStaffByUsername(?)`,
      [loginObj.username]
    );
    await conn.end();
    return res.status(200).json({ status: 'success', user: rows[0] });
  } catch (error) {
    if ((error as QueryError).code == 'ER_ACCESS_DENIED_ERROR') {
      return res.status(401).json({ message: 'UNAUTHORIZED' });
    }

    return res
      .status(500)
      .json({ message: 'internal server error', detail: error });
  }
});

export default authRouter;

import { PoolOptions, RowDataPacket } from "mysql2/promise";

import { getMySqlConnnection } from "../db/mysql";
import { GetRequestResult } from "./queryResult";

export default class DepartmentService {
  public constructor() {}

  public async getAllDepartments(
    config: PoolOptions
  ): Promise<GetRequestResult> {
    const conn = await getMySqlConnnection(config);
    const [rows, _fields] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM departments;`
    );
    await conn.end();
    return {
      queryResult: {
        count: rows.length,
      },
      data: rows,
    };
  }
}

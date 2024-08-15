import { RowDataPacket } from "mysql2/promise";
import connection from "../db/mysql";
import { GetRequestResult } from "./queryResult";

export default class DepartmentService {
  public constructor() {}

  public async getAllDepartments(): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM departments;`
    );
    return {
      queryResult: {
        count: rows.length,
      },
      data: rows,
    };
  }
}

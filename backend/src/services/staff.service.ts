import { ProcedureCallPacket, RowDataPacket } from "mysql2/promise";
import connection from "../db/mysql";
import { GetRequestResult } from "./queryResult";

export default class StaffService {
  public constructor() {}

  public async getAllStaffs(props: {
    order?: "asc" | "desc";
  }): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(
      `CALL S_ListStaffByName("${
        props.order ? props.order.toLocaleLowerCase() : "asc"
      }")`
    );
    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }
}

import {
  ProcedureCallPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
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

  public async listStaffByDep(props: {
    depId: number;
  }): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(`CALL S_ListStaffByDepartmentID("${props.depId}")`);
    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async getStaffSchedule(props: {
    staffId: number;
  }): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(`CALL S_ViewStaffScheduleByID("${props.staffId}")`);
    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async createSingleNewStaff(props: {
    firstName: string;
    lastName: string;
    jobType: string;
    qualification: string;
    deptId: number;
    salary: number;
  }): Promise<any> {
    const conn = await connection;
    const [_rows, _fields] = await conn.query<
      ProcedureCallPacket<ResultSetHeader>
    >(`CALL S_AddNewStaff(
      "${props.firstName}",
      "${props.lastName}",
      "${props.jobType}",
      "${props.qualification}",
      "${props.deptId}",
      "${props.salary}"
      )`);

    return {
      status: "success",
    };
  }
}

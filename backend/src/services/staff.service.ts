import {
  ProcedureCallPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import connection from "../db/mysql";
import { GetRequestResult } from "./queryResult";

export default class StaffService {
  tzoffset = new Date().getTimezoneOffset() * 60000;
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

  public async getAllDoctor(): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM staffs WHERE job_type = "Doctor"`
    );
    return {
      queryResult: {
        count: rows.length,
      },
      data: rows,
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

  public async updateStaffSchedule(
    staffId: number,
    props: {
      appointmentId: number;
      newStartTime: Date;
      newEndTime: Date;
    }
  ): Promise<any> {
    const conn = await connection;

    const newStartTimeStr = new Date(
      props.newStartTime.getTime() - this.tzoffset
    )
      .toISOString()
      .slice(0, -1);

    const newEndTimeStr = new Date(props.newEndTime.getTime() - this.tzoffset)
      .toISOString()
      .slice(0, -1);

    console.log(newEndTimeStr);

    const [_rows, _fields] = await conn.query<
      ProcedureCallPacket<ResultSetHeader>
    >(`CALL S_UpdateStaffSchedule(
      ${staffId},
      ${props.appointmentId},
      "${newStartTimeStr}",
      "${newEndTimeStr}"
      )`);

    return {
      status: "success",
    };
  }
}

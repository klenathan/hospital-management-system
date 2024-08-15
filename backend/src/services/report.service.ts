import { ProcedureCallPacket, RowDataPacket } from "mysql2/promise";
import connection from "../db/mysql";
import { GetRequestResult } from "./queryResult";

export default class ReportService {
  public constructor() {}

  public async getPatientTreatments(
    patientId: number | undefined,
    startTime: string,
    endTime: string
  ): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(
      `call R_ViewOneOrManyTreatmentHistoryByDuration(${
        patientId ?? "null"
      }, "${startTime}", "${endTime}")`
    );

    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async getStaffHistory(props: {
    staffId: number;
  }): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(`CALL R_ViewOneJobChangeHistoryByID("${props.staffId}")`);
    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async getDoctorWork(
    staffId: number | undefined,
    startTime: string,
    endTime: string
  ): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(
      `call R_ViewOneOrManyDoctorWorkByDuration(${
        staffId ?? "null"
      }, "${startTime}", "${endTime}")`
    );

    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }
}

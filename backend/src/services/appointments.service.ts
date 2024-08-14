import { ProcedureCallPacket, RowDataPacket } from "mysql2/promise";
import connection from "../db/mysql";
import { GetRequestResult } from "./queryResult";

export default class AppointmentService {
  public constructor() {}

  public async getAllAppointments(
    staffId: number | undefined
  ): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(
      `call R_ViewOneOrManyTreatmentHistoryByDuration(${
        staffId ?? "null"
      }, "2024-08-10 14:00:00", "2024-08-12 14:30:00")`
    );

    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async getAllDoctorSchedule(
    startTime: string,
    endTime: string
  ): Promise<GetRequestResult> {
    const conn = await connection;
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(`call A_ViewDoctorScheduleByDuration("${startTime}", "${endTime}")`);

    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }
}

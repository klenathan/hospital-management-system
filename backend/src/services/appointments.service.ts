import {
  ProcedureCallPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import connection from "../db/mysql";
import { GetRequestResult } from "./queryResult";

export default class AppointmentService {
  tzoffset = new Date().getTimezoneOffset() * 60000;
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

  public async createNewAppointment(props: {
    patientId: number;
    staffId: number;
    startTime: Date;
    endTime: Date;
    purpose: string;
  }): Promise<any> {
    const conn = await connection;

    const newStartTimeStr = new Date(props.startTime.getTime() - this.tzoffset)
      .toISOString()
      .slice(0, -1);

    const newEndTimeStr = new Date(props.endTime.getTime() - this.tzoffset)
      .toISOString()
      .slice(0, -1);

    const [_rows, _fields] = await conn.query<
      ProcedureCallPacket<ResultSetHeader>
    >(`CALL A_BookAppointmentWithDoctor(
      "${props.patientId}",
      "${props.staffId}",
      "${newStartTimeStr}",
      "${newEndTimeStr}",
      "${props.purpose}" 
      )`);

    return {
      status: "success",
    };
  }

  public async cancelAppointment(appointmentId: number): Promise<any> {
    const conn = await connection;

    const [_rows, _fields] = await conn.query<
      ProcedureCallPacket<ResultSetHeader>
    >(`CALL A_CancelAppoinment(
      "${appointmentId}"
      )`);

    return {
      status: "success",
    };
  }
}

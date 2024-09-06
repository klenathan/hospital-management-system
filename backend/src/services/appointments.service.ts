import {
  PoolOptions,
  ProcedureCallPacket,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';

import { GetRequestResult } from './queryResult';
import { getMySqlConnnection } from '../db/mysql';

export default class AppointmentService {
  tzoffset = new Date().getTimezoneOffset() * 60000;
  public constructor() {}

  public async getAllAppointments(
    staffId: number | undefined,
    config: PoolOptions
  ): Promise<GetRequestResult> {
    const conn = await getMySqlConnnection(config);
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(
      `call R_ViewOneOrManyTreatmentHistoryByDuration(${
        staffId ?? 'null'
      }, "2024-08-10 14:00:00", "2024-08-12 14:30:00")`
    );
    await conn.end();

    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async getAllDoctorSchedule(
    startTime: string,
    endTime: string,
    config: PoolOptions
  ): Promise<GetRequestResult> {
    const conn = await getMySqlConnnection(config);
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(`call A_ViewDoctorScheduleByDuration("${startTime}", "${endTime}")`);
    await conn.end();
    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async getAllAppointmentByDoctotId(
    doctorId: number,
    config: PoolOptions
  ): Promise<GetRequestResult> {
    const conn = await getMySqlConnnection(config);

    const [rows, _fields] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM appointments where deleted=0 and staff_id=?`,
      doctorId
    );

    await conn.end();
    return {
      queryResult: {
        count: rows.length,
      },
      data: rows,
    };
  }

  public async createNewAppointment(
    props: {
      patientId: number;
      staffId: number;
      startTime: Date;
      endTime: Date;
      purpose: string;
    },
    config: PoolOptions
  ): Promise<any> {
    const conn = await getMySqlConnnection(config);

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
    await conn.end();
    return {
      status: 'success',
    };
  }

  public async cancelAppointment(
    appointmentId: number,
    config: PoolOptions
  ): Promise<any> {
    const conn = await getMySqlConnnection(config);

    const [_rows, _fields] = await conn.query<
      ProcedureCallPacket<ResultSetHeader>
    >(`CALL A_CancelAppoinment(
      "${appointmentId}"
      )`);
    await conn.end();
    return {
      status: 'success',
    };
  }
}

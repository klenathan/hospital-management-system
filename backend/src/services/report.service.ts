import {
  PoolOptions,
  ProcedureCallPacket,
  RowDataPacket,
} from 'mysql2/promise';

import { getMySqlConnnection } from '../db/mysql';
import { GetPaginatedRequestResult, GetRequestResult } from './queryResult';

export default class ReportService {
  public constructor() {}

  public async getPatientTreatments(
    patientId: number | undefined,
    startTime: string,
    endTime: string,
    config: PoolOptions
  ): Promise<GetRequestResult> {
    const conn = await getMySqlConnnection(config);
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(
      `call R_ViewOneOrManyTreatmentHistoryByDuration(${
        patientId ?? 'null'
      }, "${startTime}", "${endTime}")`
    );
    await conn.end();
    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async getStaffHistory(
    props: {
      staffId: number;
    },
    config: PoolOptions
  ): Promise<GetRequestResult> {
    const conn = await getMySqlConnnection(config);
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(`CALL R_ViewOneJobChangeHistoryByID("${props.staffId}")`);

    await conn.end();
    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async getAllStaffHistory(
    props: {
      order: 'asc' | 'desc';
      pageSize: number;
      pageNumber: number;
    } = {
      order: 'asc',
      pageSize: 0,
      pageNumber: 0,
    },
    config: PoolOptions
  ): Promise<GetPaginatedRequestResult> {
    const conn = await getMySqlConnnection(config);

    const [rows, _fields] = await conn.query<RowDataPacket[]>(
      `SELECT sj.*, s.first_name, s.last_name FROM staff_job_history sj JOIN staffs s ON s.id = sj.staff_id ORDER BY sj.created_at ${props.order} LIMIT ? OFFSET ?`,
      [props.pageSize, (props.pageNumber - 1) * props.pageSize]
    );

    const [countRow, _countFields] = await conn.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM staff_job_history`,
      [props.pageSize, (props.pageNumber - 1) * props.pageSize]
    );

    await conn.end();
    return {
      queryResult: {
        count: rows.length,
        pageNumber: props.pageNumber,
        pageSize: props.pageSize,
        totalCount: countRow[0]['total'] as number,
      },
      data: rows,
    };
  }

  public async getDoctorWork(
    staffId: number | undefined,
    startTime: string,
    endTime: string,
    config: PoolOptions
  ): Promise<GetRequestResult> {
    const conn = await getMySqlConnnection(config);
    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(
      `call R_ViewOneOrManyDoctorWorkByDuration(${
        staffId ?? 'null'
      }, "${startTime}", "${endTime}")`
    );

    await conn.end();

    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }
}

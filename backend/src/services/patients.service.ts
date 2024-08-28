import {
  PoolOptions,
  ProcedureCallPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

import { getMySqlConnnection } from "../db/mysql";
import { GetPaginatedRequestResult } from "./queryResult";

export default class PatientService {
  tzoffset = new Date().getTimezoneOffset() * 60000;
  public constructor() {}

  public async getAllPatients(
    props: {
      order: "asc" | "desc";
      pageSize: number;
      pageNumber: number;
    } = {
      order: "asc",
      pageSize: 0,
      pageNumber: 0,
    },
    config: PoolOptions
  ): Promise<GetPaginatedRequestResult> {
    const conn = await getMySqlConnnection(config);

    const [rows, _fields] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM patients 
      ORDER BY first_name ${props.order}, last_name ${props.order}
      LIMIT ? OFFSET ?`,
      [props.pageSize, (props.pageNumber - 1) * props.pageSize]
    );
    return {
      queryResult: {
        count: rows.length,
        pageNumber: props.pageNumber,
        pageSize: props.pageSize,
      },
      data: rows,
    };
  }

  public async getPatientByID(
    props: { id: number },
    config: PoolOptions
  ): Promise<any> {
    const conn = await getMySqlConnnection(config);

    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(`CALL P_SearchPatientById(${props.id})`);

    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async getPatientByName(
    props: { name: string },
    config: PoolOptions
  ): Promise<any> {
    const conn = await getMySqlConnnection(config);

    const [rows, _fields] = await conn.query<
      ProcedureCallPacket<RowDataPacket[]>
    >(`CALL P_SearchPatitentByName("${props.name}")`);

    return {
      queryResult: {
        count: rows[0].length,
      },
      data: rows[0],
    };
  }

  public async createNewPatient(
    props: {
      firstName: string;
      lastName: string;
      dob: string;
      contactInfo: string;
      address: string;
      allergies?: string;
    },
    config: PoolOptions
  ): Promise<any> {
    const conn = await getMySqlConnnection(config);

    const [_rows, _fields] = await conn.query<
      ProcedureCallPacket<ResultSetHeader>
    >(`CALL SP_RegisterNewPatient(
      "${props.firstName}",
      "${props.lastName}",
      "${props.dob}",
      "${props.contactInfo}",
      "${props.address}",
      "${props.allergies ?? "None"}",
      )`);

    return {
      status: "success",
    };
  }

  public async createNewTreatment(
    props: {
      patientId: number;
      staffId: number;
      treatmentDate: Date;
      treatmentDetail?: string;
    },
    config: PoolOptions
  ): Promise<any> {
    const conn = await getMySqlConnnection(config);

    const treatmentDateStr = new Date(
      props.treatmentDate.getTime() - this.tzoffset
    )
      .toISOString()
      .slice(0, -1);

    const [_rows, _fields] = await conn.query<
      ProcedureCallPacket<ResultSetHeader>
    >(`CALL P_AddTreatment(
      "${props.patientId}",
      "${props.staffId}",
      "${treatmentDateStr}",
      "${props.treatmentDetail ?? ""}"
      )`);
    return {
      status: "success",
    };
  }

  async updatePatientInfo(
    props: {
      id: string;
      first_name: string;
      last_name: string;
      date_of_birth: string;
      contact_info: string;
      address: string;
      allergies?: string;
    },
    config: PoolOptions
  ): Promise<any> {
    const conn = await getMySqlConnnection(config);

    const [_rows, _fields] = await conn.query<
      ProcedureCallPacket<ResultSetHeader>
    >(`CALL P_UpdatePatientInfo(
      "${props.id}",
      "${props.first_name}",
      "${props.last_name}",
      "${props.date_of_birth}",
      "${props.contact_info}",
      "${props.address}",
      "${props.allergies ?? ""}"
      )`);

    return {
      status: "success",
    };
  }
}

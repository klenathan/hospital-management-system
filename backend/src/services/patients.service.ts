import {
  RowDataPacket,
  ProcedureCallPacket,
  ResultSetHeader,
} from "mysql2/promise";
import connection from "../db/mysql";
import { GetRequestResult } from "./queryResult";

export default class PatientService {
  public constructor() {}

  public async getAllPatients(props: {
    order?: "asc" | "desc";
  }): Promise<GetRequestResult> {
    const conn = await connection;
    const order = props.order ?? "asc";
    const [rows, _fields] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM patients ORDER BY first_name ${order}, last_name ${order}`
    );
    return {
      queryResult: {
        count: rows.length,
      },
      data: rows,
    };
  }

  public async getPatientByID(props: { id: number }): Promise<any> {
    const conn = await connection;

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

  public async getPatientByName(props: { name: string }): Promise<any> {
    const conn = await connection;

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

  public async createNewPatient(props: {
    firstName: string;
    lastName: string;
    dob: string;
    contactInfo: string;
    address: string;
    allergies?: string;
  }): Promise<any> {
    const conn = await connection;

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

    return true;
  }
}

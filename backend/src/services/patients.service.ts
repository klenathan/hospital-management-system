import connection from "../db/mysql";

export default class PatientService {
  public constructor() {}

  public async getAllPatients() {
    const conn = await connection;
    const patients = conn.execute("SELECT * FROM `patients`");
    return patients.then((result) => result[0]);
  }
}

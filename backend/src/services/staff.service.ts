import connection from "../db/db";

export default class StaffService {
  public constructor() {}

  public async getAllStaffs() {
    const conn = await connection;
    const patients = conn.execute("SELECT * FROM `staffs`");
    return patients.then((result) => result[0]);
  }
}

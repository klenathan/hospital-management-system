import connection from "../db/mysql";

export default class TreatmentService {
  public constructor() {}

  public async getAllTreatments() {
    const conn = await connection;
    const patients = conn.execute(
      "SELECT * FROM `treatments` order by `id` ASC"
    );
    return patients.then((result) => result[0]);
  }
}

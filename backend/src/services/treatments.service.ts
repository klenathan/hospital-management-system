import { PoolOptions } from "mysql2";
import { getMySqlConnnection } from "../db/mysql";
export default class TreatmentService {
  public constructor() {}

  public async getAllTreatments(config: PoolOptions) {
    const conn = await getMySqlConnnection(config);
    const patients = conn.execute(
      "SELECT * FROM `treatments` order by `id` ASC"
    );
    return patients.then((result) => result[0]);
  }
}

import connection from "../db/db";

export default class AppointmentService {
  public constructor() {}

  public async getAllAppointments() {
    const conn = await connection;
    const patients = conn.execute(
      "SELECT * FROM `appointments` order by `id` ASC"
    );
    return patients.then((result) => result[0]);
  }
}

import mysql, { PoolOptions } from "mysql2/promise";
import CONFIG from "../config";

const access: PoolOptions = {
  host: CONFIG.dbHost,
  user: CONFIG.dbUser,
  password: CONFIG.dbPwd,
  database: CONFIG.dbDatabase,
};

const connection = mysql.createConnection(access);
//   .then((conn) => {
//     console.log("Connected");

//     return conn;
//   })
//   .catch((e) => {
//     console.log(e);
//     throw new Error("Failed to connect to database");
//   });

export default connection;

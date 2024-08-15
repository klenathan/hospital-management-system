import mysql, { PoolOptions } from "mysql2/promise";
import CONFIG from "../config";

const access: PoolOptions = {
  host: CONFIG.dbHost,
  user: CONFIG.dbUser,
  password: CONFIG.dbPwd,
  database: CONFIG.dbDatabase,
};

// const configBuilder = (username: string, password: string) => {
//   return {
//     host: CONFIG.dbHost,
//     user: username,
//     password: password,
//     database: CONFIG.dbDatabase,
//   };
// };

// console.log("[CREDENTIAL]", configBuilder("test", "test"));

console.log(access);

const connection = mysql.createConnection(access);

export default connection;

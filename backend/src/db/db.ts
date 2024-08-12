import mysql, { PoolOptions } from "mysql2/promise";
import CONFIG from "../config";

const access: PoolOptions = {
  host: CONFIG.dbHost,
  user: CONFIG.dbUser,
  password: CONFIG.dbPwd,
  database: CONFIG.dbDatabase,
};

const configBuilder = (username: string, password: string) => {
  return {
    host: CONFIG.dbHost,
    user: username,
    password: password,
    database: CONFIG.dbDatabase,
  };
};

console.log(configBuilder("test", "test"));

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

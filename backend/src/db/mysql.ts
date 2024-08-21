import mysql, { PoolOptions } from "mysql2/promise";
import CONFIG from "../config";

// const configBuilder = (username: string, password: string) => {
//   return {
//     host: CONFIG.dbHost,
//     user: username,
//     password: password,
//     database: CONFIG.dbDatabase,
//   };
// };

// console.log("[CREDENTIAL]", configBuilder("test", "test"));

// const connection = mysql.createConnection(access);

const dbConfigBuilder = (username: string, password: string): PoolOptions => {
  return {
    host: CONFIG.dbHost,
    user: username,
    password: password,
    database: CONFIG.dbDatabase,
  };
};

const getMySqlConnnection = async (
  config: PoolOptions
): Promise<mysql.Connection> => {
  return await mysql.createConnection(config);
};

export { getMySqlConnnection, dbConfigBuilder };

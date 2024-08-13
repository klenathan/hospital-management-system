import dotenv from "dotenv";

dotenv.config();

const CONFIG = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPwd: process.env.DB_PWD,
  dbDatabase: process.env.DB_DATABASE || "hospital_management",

  mongoUser: process.env.mongoUser || "root",
  mongoPassword: process.env.mongoPassword || "example",
  mongoHost: process.env.mongoHost || "127.0.0.1",
  mongoPort: process.env.port || "27017",
};

export default CONFIG;

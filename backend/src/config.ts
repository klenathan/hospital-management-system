import dotenv from "dotenv";

dotenv.config();

const CONFIG = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST,
  dbUser: "doctor", // process.env.DB_USER,
  dbPwd: process.env.DB_PWD,
  dbDatabase: process.env.DB_DATABASE || "hospital_management",
};

export default CONFIG;

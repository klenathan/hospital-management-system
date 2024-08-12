import dotenv from "dotenv";

dotenv.config();

const CONFIG = {
  port: process.env.PORT || 3000,
};

export default CONFIG;

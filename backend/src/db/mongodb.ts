import { MongoClient } from "mongodb";
import CONFIG from "../config";

const url = `mongodb://${CONFIG.mongoUser}:${CONFIG.mongoPassword}@${CONFIG.mongoHost}`;

console.log(process.env.mongoHost);
console.log(url);

const client = new MongoClient(url);

export { client };

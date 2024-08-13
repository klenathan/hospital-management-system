import { MongoClient } from "mongodb";
import CONFIG from "../config";

const url = `mongodb://${CONFIG.mongoUser}:${CONFIG.mongoPassword}@${CONFIG.mongoHost}:${CONFIG.mongoPort}`;

const client = new MongoClient(url);

export { client };

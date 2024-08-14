import { GridFSBucket, GridFSFile } from "mongodb";
import { client } from "../db/mongodb";
import * as fs from "fs";

export default class BLobService {
  dbName = "blob_storage";
  public constructor() {}

  public async listFiles(bucketName: string): Promise<GridFSFile[]> {
    let files: GridFSFile[] = [];
    try {
      await client.connect();

      const db = client.db(this.dbName);

      const bucket = new GridFSBucket(db, { bucketName: bucketName });

      files = await bucket.find().toArray();
    } catch (error) {
      console.log(error);
    } finally {
      await client.close();
    }

    return files;
  }

  public async uploadFile(bucketName: string): Promise<boolean> {
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const bucket = new GridFSBucket(db, { bucketName: bucketName });

      fs.createReadStream("./assets/samsung_monitor.jpg").pipe(
        bucket.openUploadStream("myFile", {
          metadata: { field: "name", value: "file_name_test" },
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      await client.close();
    }
    return true;
  }
}

import { GridFSBucket, GridFSBucketWriteStream, GridFSFile } from "mongodb";
import { Readable } from "stream";
import { client } from "../db/mongodb";

// interface IBLobImageMetadata {
//   fileName: string;
//   domain: string;
//   parentId: string;
// }

export default class BlobService {
  dbName = "blob_storage";
  public constructor() {}

  public async listFiles(
    bucketName: string,
    query: {
      fileName?: string;
      domain?: string;
      parent?: string;
    }
  ): Promise<GridFSFile[]> {
    console.log(query);

    let files: GridFSFile[] = [];
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const bucket = new GridFSBucket(db, { bucketName: bucketName });

      let queryBuilder: { [k: string]: any } = {};

      if (query.domain) {
        queryBuilder["metadata.domain"] = query.domain;
      }

      if (query.fileName) {
        queryBuilder["metadata.fileName"] = query.fileName;
      }

      if (query.parent) {
        queryBuilder["metadata.parent"] = query.parent;
      }

      files = await bucket.find(queryBuilder).toArray();
    } catch (error) {
      console.log(error);
    } finally {
      await client.close();
    }

    return files;
  }

  public async uploadFile(
    bucketName: string,
    metadata: {
      fileName: string;
      domain: string;
      parent: string;
    },
    fileBuffer: Buffer
  ): Promise<any> {
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const bucket = new GridFSBucket(db, { bucketName: bucketName });

      const uploadStream = bucket.openUploadStream(metadata.fileName, {
        metadata,
      });
      const bufferStream = Readable.from(fileBuffer);

      const uploadPromise: Promise<GridFSBucketWriteStream> = new Promise(
        (resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on("error", (err: Error) => {
              reject(err);
            })
            .on("finish", () => {
              resolve(uploadStream);
            });
        }
      );
      const result = await uploadPromise;

      await client.close();
      return result.gridFSFile;
    } catch (error) {
      console.log(error);
      await client.close();
      return { status: false };
    }
  }
}

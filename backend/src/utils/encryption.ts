import * as crypto from "crypto";
import { promises as fs } from "fs";
// import * as assert from "assert";

export const encrypt = async (input: string): Promise<string> => {
  const publicKey = await fs.readFile("./key/public_key.pem", {
    encoding: "utf-8",
  });
  return crypto
    .publicEncrypt(publicKey, Buffer.from(input, "utf8"))
    .toString("base64");
};

export const decrypt = async (cipher: string): Promise<string> => {
  const privateKey = await fs.readFile("./key/private_key.pem", {
    encoding: "utf-8",
  });
  return crypto
    .privateDecrypt(
      {
        key: privateKey,
        passphrase: "",
      },
      Buffer.from(cipher, "base64")
    )
    .toString("utf8");
};

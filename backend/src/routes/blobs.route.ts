import { Request, Response, Router } from "express";

import BlobService from "../services/blobs.service";
import multer from "multer";

const MIME: Record<string, string> = {
  html: "text/html",
  txt: "text/plain",
  css: "text/css",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  svg: "image/svg+xml",
  js: "application/javascript",
};

const blobRouter = Router();

const blobService = new BlobService();
blobRouter.get("/", async (req: Request, res: Response) => {
  /* #swagger.summary = "Get all blobs"
  #swagger.parameters['domain'] = {
    in: 'query',
    name: 'domain',
    description: 'Blob domain query',
    type: 'string'
    },
    #swagger.parameters['fileName'] = {
        in: 'query',
        name: 'fileName',
        description: 'Blob filename query',
        type: 'string'
    },
    #swagger.parameters['parent'] = {
        in: 'query',
        name: 'parent',
        description: 'Blob parent ID query',
        type: 'string'
    },
*/
  try {
    //   dbConfigBuilder(res.locals["username"], res.locals["password"])
    const blobs = await blobService.listFiles("testBucket", {
      domain: req.query["domain"] as string | undefined,
      fileName: req.query["fileName"] as string | undefined,
      parent: req.query["parent"] as string | undefined,
    });
    return res.status(200).send({
      count: blobs.length,
      data: blobs,
    });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

blobRouter.post(
  "/",
  multer().single("blob"),
  async (req: Request, res: Response) => {
    /* #swagger.summary = "Add new blob"
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['blob'] = {
            in: 'formData',
            name: 'blob',
            description: 'Add new blob',
            type: 'file'
    },
    #swagger.parameters['domain'] = {
            in: 'formData',
            name: 'domain',
            description: 'blob domain, e.g: staff, patient, appointment',
            type: 'string'
    }
    #swagger.parameters['parentId'] = {
            in: 'formData',
            name: 'parentId',
            description: 'Parent Object ID',
            type: 'string'
    }
  */

    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "INVALID FILE" });
      }

      const blobs = await blobService.uploadFile(
        "testBucket",
        {
          fileName: file.originalname,
          domain: req.body.domain,
          parent: req.body.parentId,
        },
        file.buffer
      );
      return res.status(200).send(blobs);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
);

blobRouter.get("/image/:id", async (req: Request, res: Response) => {
  /* #swagger.summary = "Serve image"
  #swagger.parameters['id'] = {
    in: 'path',
    name: 'id',
    description: 'Retrieve blob by `id`',
    type: 'string'
    }
*/
  try {
    const id = req.params["id"] as string | undefined;

    if (!id) {
      return res.status(400).json({ error: "INVALID ID" });
    }

    const [file, fileName] = await blobService.getFile("testBucket", id);

    const ext = fileName.split(".").at(-1);
    if (!ext) {
      return res.status(400).json({ error: "Error parsing filename" });
    }

    if (!Object.keys(MIME).includes(ext)) {
      return res.status(400).json({ error: "Not an image" });
    }

    const type = MIME[fileName.split(".").at(-1) as string];

    res.set("Content-Type", type);
    return res.status(200).end(file);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

blobRouter.get("/download/:id", async (req: Request, res: Response) => {
  /* #swagger.summary = "Download blob by ID"
  #swagger.parameters['id'] = {
    in: 'path',
    name: 'id',
    description: 'Retrieve blob by `id`',
    type: 'string'
    }
*/
  try {
    const id = req.params["id"] as string | undefined;

    if (!id) {
      return res.status(400).json({ error: "INVALID ID" });
    }

    // const blobs = await blobService.listFiles("testBucket", {
    //   domain: req.query["domain"] as string | undefined,
    //   fileName: req.query["fileName"] as string | undefined,
    //   parent: req.query["parent"] as string | undefined,
    // });

    const [file, fileName] = await blobService.getFile("testBucket", id);
    res.set("Content-disposition", "attachment; filename=" + fileName);
    return res.status(200).send(file);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});
export default blobRouter;

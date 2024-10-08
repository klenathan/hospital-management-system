// import dotenv from "dotenv";

import "module-alias/register";

import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import path from "path";

import CONFIG from "./config";
import router from "./routes/router";

import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocs from "./swagger/swagger.json";

const port = CONFIG.port;
const app: Express = express();

app.disable("x-powered-by");

app.use(cors({}));
app.use(express.json());

// logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.startTime = Date.now();

  res.on("finish", () => {
    const time = new Date(Date.now()).toISOString();
    const timeDelta = Date.now() - res.locals.startTime;
    const codeStr = res.statusCode >= 400 ? 31 : 32;
    const log = `${time}: [${req.method}] ${(req.hostname, req.path)} `;

    var output =
      log + `\x1b[${codeStr}m${res.statusCode} \x1b[0m` + ` ${timeDelta}ms`;
    console.log(output);
  });

  next();
});

//// SERVICE API

app.use("/api", router);

//// SWAGGER

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//// SERVE FRONT-END

app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

app.get("*", (_: Request, res: Response) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "frontend", "dist", "index.html")
  );
});

//// START SERVER

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}/docs`);
});

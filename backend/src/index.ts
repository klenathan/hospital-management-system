// import dotenv from "dotenv";

import CONFIG from "./config";
import "module-alias/register";

import express, { Express, NextFunction, Request, Response } from "express";
import path from "path";
import router from "./routes/router";

import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocs from "./swagger/swagger.json";

const port = CONFIG.port;
const app: Express = express();

// logger middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const time = new Date(Date.now()).toISOString();
  console.log(`${time}: [${req.method}] ${(req.hostname, req.path)}`);
  next();
});

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
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// import dotenv from "dotenv";

import CONFIG from "./config";

import express, { Express, Request, Response } from "express";
import path from "path";
import router from "./routes/router";

import * as swaggerUi from "swagger-ui-express";

import * as swaggerDocs from "./swagger/swagger.json";

const app: Express = express();

const port = CONFIG.port;

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

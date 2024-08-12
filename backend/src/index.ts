// import dotenv from "dotenv";

import CONFIG from "./config";

import express, { Express, Request, Response } from "express";
import path from "path";
import router from "./routes/router";

// dotenv.config();

const app: Express = express();

const port = CONFIG.port;

app.use("/api", router);

app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

app.get("*", (_: Request, res: Response) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "frontend", "dist", "index.html")
  );
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

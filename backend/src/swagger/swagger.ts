import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Hospital management system API",
    description: "A RMIT Database application assignment",
  },
  host: "localhost:3000",
  definitions: {
    serverErrSchema: {
      $message: "Internal server error",
    },
    errSchema: {
      $message: "Your error, not mine",
    },
  },
};

const outputFile = "./swagger.json";
const routes = ["./src/index.ts"];

swaggerAutogen(outputFile, routes, doc);

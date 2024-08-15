import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Hospital management system API",
    version: "v0.0.1",
    description: "A RMIT Database application assignment",
  },
  host: "localhost:3000",
  definitions: {
    requiredAuth: {
      $username: "username",
      $password: "password",
    },
    serverErrSchema: {
      $message: "Internal server error",
    },
    errSchema: {
      $message: "Your error, not mine",
    },
  },
  securityDefinitions: {
    authStr: {
      type: "apiKey",
      name: "x-auth-string",
      scheme: "bearer",
      in: "header",
    },
  },
  security: [{ authStr: [] }],
};

const outputFile = "./swagger.json";
const routes = ["./src/index.ts"];

swaggerAutogen(outputFile, routes, doc);

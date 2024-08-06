const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Instagram API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000", // Change this to your server URL
      },
    ],
  },
  apis: [
    "./user/routes.js",
    "./comment/routes.js",
    "./post/routes.js",
    "./like/routes.js",
    "./follower/routes.js",
    "./feed/routes.js",
  ], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

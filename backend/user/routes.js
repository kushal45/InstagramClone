const { Router } = require("express");
const AuthMiddleware = require("./middleware/Auth");
const RedisMiddleware = require("../middleware/Redis");
const CacheHowiam = require("../middleware/RedisCache");
const ValidationAuth= require("./validations/Auth");
const ValidationsUser = require("./validations/User");
const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");

const routes = Router();

// ** Routes Authenticate ** //
routes.post("/auth", ValidationAuth.login, AuthController.login);
routes.get(
  "/auth",
  AuthMiddleware,
  RedisMiddleware,
  CacheHowiam,
  AuthController.howIam
);


// ** Routes user ** //
routes.get("/users/:username", AuthMiddleware, UserController.show);
routes.post("/users", ValidationsUser.withPassword, UserController.store);
routes.put(
  "/users",
  AuthMiddleware,
  ValidationsUser.withoutPassword,
  UserController.update
);
routes.put(
  "/password-update",
  AuthMiddleware,
  ValidationsUser.password,
  UserController.updatePassword
);

module.exports = routes;

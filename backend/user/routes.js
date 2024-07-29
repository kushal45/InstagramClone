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
routes.post("/login", ValidationAuth.login, AuthController.login);
routes.get(
  "/howIam",
  AuthMiddleware,
  RedisMiddleware,
  CacheHowiam,
  AuthController.howIam
);


// ** Routes user ** //
routes.get("/:username", AuthMiddleware, UserController.show);
routes.post("/register", ValidationsUser.withPassword, UserController.store);
routes.put(
  "/update",
  AuthMiddleware,
  ValidationsUser.withoutPassword,
  UserController.update
);
routes.put(
  "/password",
  AuthMiddleware,
  ValidationsUser.password,
  UserController.updatePassword
);

module.exports = routes;

const { Router, application } = require("express");
//const multer = require("multer");
//const multerConfig = require("./config/multer");

const routes = Router();

const AuthMiddleware = require("./user/middleware/Auth");

const RedisMiddleware = require("./middleware/Redis"); // Middleware of redis
const CacheHowiam = require("./middleware/RedisCache"); // Middleware of redis
const errorHandler = require('./middleware/ErrorHandler');

const ValidationsUser = require("./user/validations/User");
const ValidationAuth = require("./user/validations/Auth");
const ValidationPost = require("./post/validations/Post");
const ValidationComment = require("./comment/validations/Comment");
const ValidationLike = require("./like/validations/Like");

const AuthController = require("./user/controllers/AuthController");
const UserController = require("./user/controllers/UserController");
const PostController = require("./post/controllers/PostController");
const CommentController = require("./comment/controllers/CommentController");
const LikeController = require("./like/controllers/LikeController");

// ** Routes Authenticate ** //
routes.post("/auth", ValidationAuth.login, AuthController.login);
routes.get(
  "/auth",
  AuthMiddleware,
  RedisMiddleware,
  CacheHowiam,
  AuthController.howIam
);

// ** Routes Authenticate ** //

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

// ** Routes Post ** //

routes.post(
  "/post",
  AuthMiddleware,
  ValidationPost.validatePost,
  PostController.createPost
);
routes.get("/posts", AuthMiddleware, PostController.getAllPosts);
routes.get("/post/:id", AuthMiddleware, PostController.getPostById);

// ** Routes Comment ** //
routes.post(
  "/comment",
  AuthMiddleware,
  ValidationComment.validateComment,
  CommentController.create
);
routes.get("/comment/:id", AuthMiddleware, CommentController.getById);

// ** Routes Like ** //

routes.post(
  "/like",
  AuthMiddleware,
  LikeController.like
);

routes.put(
  "/unlike",
  AuthMiddleware,
  ValidationLike.validateLike,
  LikeController.unlike
);
routes.get("/like", AuthMiddleware, LikeController.show);
routes.post("/remove", AuthMiddleware, LikeController.delete);

routes.use(errorHandler);

module.exports = routes;

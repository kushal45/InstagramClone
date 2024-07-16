const { Router } = require("express");
const AuthMiddleware = require("../user/middleware/Auth");
const ValidationPost = require("./validations/Post");
const PostController = require("./controllers/PostController");

const routes = Router();

// ** Routes Post ** //

routes.post(
    "/post",
    AuthMiddleware,
    ValidationPost.validatePost,
    PostController.createPost
  );
  routes.get("/posts", AuthMiddleware, PostController.getAllPosts);
  routes.get("/post/:id", AuthMiddleware, PostController.getPostById);

  module.exports = routes;
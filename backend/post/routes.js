const { Router } = require("express");
const AuthMiddleware = require("../user/middleware/Auth");
const ValidationPost = require("./validations/Post");
const PostController = require("./controllers/PostController");

const routes = Router();

// ** Routes Post ** //

routes.post(
    "",
    AuthMiddleware,
    ValidationPost.validatePost,
    PostController.createPost
  );
  routes.get("", AuthMiddleware, PostController.getAllPosts);
  routes.get("/:id", AuthMiddleware, PostController.getPostById);

  module.exports = routes;
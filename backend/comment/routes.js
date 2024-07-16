const { Router } = require("express");
const AuthMiddleware = require("../user/middleware/Auth");
const ValidationComment = require("./validations/Comment");
const CommentController = require("./controllers/CommentController");

const routes = Router();

// ** Routes Comment ** //
routes.post(
    "/comment",
    AuthMiddleware,
    ValidationComment.validateComment,
    CommentController.create
  );
  routes.get("/comment/:id", AuthMiddleware, CommentController.getById);

  module.exports = routes;
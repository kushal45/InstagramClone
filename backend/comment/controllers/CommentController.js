const CommentService = require("../services/CommentService");
const logger = require("../../logger/logger");

module.exports = {
  create: async (req, res, next) => {
    try {
      logger.debug("req body comment", req.body);
      const comment = await CommentService.createComment({
        ...req.body,
        userId: req.userId,
      });
      res.status(201).send({ message: "Comment created", comment });
    } catch (error) {
      logger.debug(error);
      next(error);
    }
  },

  getCommentsByPostId: async (req, res, next) => {
    try {
      const comments = await CommentService.getCommentsByPostId(req.params.postId);
      res.status(200).send(comments);
    } catch (error) {
      logger.debug(error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const comment = await CommentService.getCommentById(req.params.id);
      res.status(200).send(comment);
    } catch (error) {
      logger.debug(error);
      next(error);
    }
  },
};

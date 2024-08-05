const { Comment, Asset } = require("../../models");
const { NotFoundError } = require("../../errors");
const logger = require("../../logger/logger");

class CommentDao {
    static async create({ userId, postId, assetId  }) {
      const comment = await Comment.create({
        userId,
        postId,
        assetId,
      });
      logger.debug(`Comment created with ID: ${comment.id}`);
      return comment;
    }
  
    static async getById(id) {
      const comment = await Comment.findByPk(id,{
        include: [{ model: Asset, as: "asset" }],
      });
      if (!comment) {
        throw new NotFoundError('Comment not found');
      }
      return comment;
    }
  }

  module.exports= CommentDao;


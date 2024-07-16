const { Comment, Asset } = require("../../models");

class CommentDao {
    static async create({ userId, postId, assetId  }) {
      const comment = await Comment.create({
        userId,
        postId,
        assetId,
      });
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


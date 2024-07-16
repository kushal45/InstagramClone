const { Comment, User, Post, Asset } = require("../../models");
const { NotFoundError } = require('../../errors');
const { UserDAO, AssetDAO, CommentDAO } = require("../../dao");
const PostDao = require("../../post/dao/PostDao");


class CommentService {
  static async createComment({ username, postId, imageUrl, videoUrl, text }) {
    const user = await UserDAO.findUserByQuery({  username  });
    if (!user)throw new NotFoundError("User not found");

    const post = await PostDao.getById(postId);
    if (!post) throw new NotFoundError("Post not found");

    const asset = await AssetDAO.create({ imageUrl, videoUrl, text });
    const comment = await CommentDAO.create({
      userId: user.id,
      postId,
      assetId: asset.id,
    });

    return comment;
  }

  static async getCommentById(id) {
    const comment = await CommentDAO.getById(id);
    if (!comment) {
        throw new NotFoundError('Comment not found');
      }

    return comment;
  }
}

module.exports = CommentService;
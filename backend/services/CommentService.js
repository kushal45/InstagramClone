const { Comment, User, Post, Asset } = require("../models");
const { NotFoundError } = require('../errors/NotFoundError');


class CommentService {
  static async createComment({ username, postId, imageUrl, videoUrl, text, tag }) {
    const user = await User.findOne({ where: { username } });
    if (!user)throw new NotFoundError("User not found");

    const post = await Post.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundError("Post not found");

    const asset = await Asset.create({ imageUrl, videoUrl, text, tag });
    const comment = await Comment.create({
      userId: user.id,
      postId,
      assetId: asset.id,
    });

    return comment;
  }

  static async getCommentById(id) {
    const comment = await Comment.findByPk(id, {
      include: [{ model: Asset, as: "asset" }],
    });
    if (!comment) {
        throw new NotFoundError('Comment not found');
      }

    return comment;
  }
}

module.exports = CommentService;
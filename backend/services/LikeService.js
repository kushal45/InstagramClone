const { Like, Post } = require("../models");

class LikeService {
  static async getLikesByPostId(postId) {
    const likes = await Like.findOne({ where: { postId } });
    return likes;
  }

  static async likePost(postId) {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post not found");

    let like = await Like.findOne({ where: { postId } });
    if (!like) {
      like = await Like.create({ postId, count: 1 });
    } else {
      like.count += 1;
      await like.save();
    }
    return like;
  }

  static async unlikePost(postId) {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post not found");

    const like = await Like.findOne({ where: { postId } });
    if (!like) throw new Error("Like not found");
    if (like.count === 0) throw new Error("Like count is already 0");

    like.count -= 1;
    await like.save();
    return like;
  }

  static async deleteLike(id) {
    const like = await Like.findByPk(id);
    if (!like) throw new Error("Like not found");

    await like.destroy();
    return { message: "Like deleted successfully" };
  }
}

module.exports = LikeService;
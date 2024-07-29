const PostDAO  = require("../../post/dao/PostDao");
const LikeDAO = require("../dao/LikeDao");
const { NotFoundError } = require("../../errors");

class LikeService {
  static async getLikesByPostId(postId) {
    const likes = await LikeDAO.getLikesByPostId(postId);
    return likes;
  }

  static async likePost(postId) {
    const post = await PostDAO.getById(postId);
    if (!post) throw new NotFoundError("Post not found");

    let like = await LikeDAO.likePost(postId);
    return like;
  }

  static async unlikePost(postId) {
    const post = await PostDAO.getById(postId);
    if (!post) throw new NotFoundError("Post not found");

    let like = await LikeDAO.unlikePost(postId);
    return like;
  }

  static async deleteLike(id) {
    try {
      await LikeDAO.delete(id);
      return { message: "Like deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LikeService;

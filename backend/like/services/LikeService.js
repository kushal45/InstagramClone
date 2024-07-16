const { PostDAO } = require("../../dao");
const LikeDAO = require("../dao/LikeDao");
const { NotFoundError } = require("../../errors");
const { Like, Post } = require("../../models");

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
   await LikeDAO.delete(id);
  }
}

module.exports = LikeService;
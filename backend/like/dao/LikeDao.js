const { NotFoundError, BadRequestError } = require("../../errors");
const { Like } = require("../../models");

class LikeDAO {
    // Get likes by postId
    static async getLikesByPostId(postId) {
      try {
        const likes = await Like.findOne({ where: { postId } });
        return likes;
      } catch (error) {
        throw error;
      }
    }

    // Get likes by postId
    static async getLikesByPostId(postId) {
      try {
        const likes = await Like.findOne({ where: { postId } });
        return likes;
      } catch (error) {
        throw error;
      }
    }
  
    // Create or increment like for a post
    static async likePost(postId) {
      try {
        let like = await Like.get({ where: { postId } });
        if (!like) {
          like = await Like.create({ postId, count: 1 });
        } else {
          like.count += 1;
          await like.save();
        }
        return like;
      } catch (error) {
        throw error;
      }
    }
  
    // Decrement like for a post or throw error if like does not exist
    static async unlikePost(postId) {
      try {
        const like = await Like.findOne({ where: { postId } });
        if (!like) throw new NotFoundError("Like not found");
        if (like.count === 0) throw new BadRequestError("Like count is already 0");
  
        like.count -= 1;
        await like.save();
        return like;
      } catch (error) {
        throw error;
      }
    }

    // Delete like by id
    static async delete(id) {
      try {
        const like = await Like.findOne({ where: { id } });
        if (!like) throw new NotFoundError("Like not found");
        await like.destroy();
      } catch (error) {
        throw error;
      }
    }
  }

  module.exports = LikeDAO;
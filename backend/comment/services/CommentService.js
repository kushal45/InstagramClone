const { NotFoundError } = require('../../errors');
const { UserDAO, AssetDAO, CommentDAO,PostDAO } = require("../../dao");


class CommentService {
  static async createComment({userId,postId, imageUrl, videoUrl, text }) {
    try {
      const user = await UserDAO.findUserById(userId);
      if (!user)throw new NotFoundError("User not found");
      
      console.log("post id to fetch",postId);
      const post = await PostDAO.getById(postId);
      if (!post) throw new NotFoundError("Post not found");
      const tags = ["other"];
      const asset = await AssetDAO.create({ imageUrl, videoUrl, text,tags});
      const comment = await CommentDAO.create({
        userId: user.id,
        postId,
        assetId: asset.id,
      });
  
      return comment;
    } catch (error) {
       throw error;
    }
   
  }

  static async getCommentById(id) {
    try {
      const comment = await CommentDAO.getById(id);
      if (!comment) {
          throw new NotFoundError('Comment not found');
        }
  
      return comment;
    } catch (error) {
      throw error; 
    }
  
  }
}

module.exports = CommentService;
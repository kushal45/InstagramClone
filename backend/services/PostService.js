const { UserDAO, AssetDAO, PostDAO } = require("../dao");
const { NotFoundError } = require("../errors");
const { User, Post, Asset, Comment } = require("../models");
//const { sendEvent } = require("../kafka/Producer");

class PostService {
  async createPost(postData, userId) {
    const user = await UserDAO.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const asset = await AssetDAO.create(postData);
    const post = await PostDAO.create({
      userId: user.id,
      assetId: asset.id,
    });
    //await sendEvent('postCreated', post);
    return post;
  }

  async getPostById(postId) {
    // Logic to fetch a post by ID
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: Post, as: "asset" },
        {
          model: Comment,
          as: "comments",
          include: [
            { model: Asset, as: "asset" }, // Corrected alias to match the association definition
          ],
        },
      ],
    });
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  }

  async updatePost(postId, updateData) {
    // Logic to update a post
    const post = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
    });
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  }

  async deletePost(postId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    // Assuming the post model has a reference to the assetId
    const assetId = post.assetId;

    // Step 2: Delete the associated asset
    const deletedAsset = await Asset.findByIdAndDelete(assetId);
    if (!deletedAsset) {
      throw new NotFoundError("Asset not found or already deleted");
    }

    // Step 3: Delete the post
    const postDeletionResult = await Post.findByIdAndDelete(postId);
    if (!postDeletionResult) {
      throw new NotFoundError("Post not found or already deleted");
    }
  }

  async listPosts(username,{ page = 1, pageSize = 10 } = {}) {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new NotFoundError("User not found");
    const skip = (page - 1) * pageSize;
    const posts = await Post.findAll({
      where: { userId: user.id },
      include: [{ model: Asset, as: "asset" }],
      offset: skip,
      limit: pageSize
    });
    return posts;
  }
}

module.exports = new PostService();

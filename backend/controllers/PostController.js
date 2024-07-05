const { User, Post, Asset, Comment } = require("../models");
module.exports = {
  /**
   * Create a new post
   * @param {Object} req - Request object containing post data
   * @param {Object} res - Response object
   */
  createPost: async (req, res) => {
    try {
      const { username, text, imageUrl, videoUrl, tag } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(404).send({ message: "User not found" });
      const asset = await Asset.create({
        imageUrl,
        videoUrl,
        text,
        tag,
      });
      const post = await Post.create({
        userId: user.id,
        assetId: asset.id,
      });
      res.status(201).send({ message: "Post created successfully", post });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error creating post", error: error.message });
    }
  },

  /**
   * Get all posts
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllPosts: async (req, res) => {
    try {
      const username = req.query.username;
      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(404).send({ message: "User not found" });
      const posts = await Post.findAll({
        where: { userId: user.id },
        include: [{ model: Asset, as: "asset" }],
      });
      res.status(200).send(posts);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error fetching posts", error: error.message });
    }
  },

  /**
   * Get a single post by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getPostById: async (req, res) => {
    try {
      // Logic to fetch a single post by id
      const post = await Post.findByPk(req.params.id, {
        include: [
          { model: Asset, as: "asset" },
          {
            model: Comment,
            as: "comments",
            include: [
              { model: Asset, as: "asset" }, // Corrected alias to match the association definition
            ],
          },
        ]
      });
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
      res.status(200).send(post);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error fetching post", error: error.message });
    }
  },

  /**
   * Update a post
   * @param {Object} req - Request object containing update data
   * @param {Object} res - Response object
   */
  updatePost: async (req, res) => {
    try {
      // Logic to update a post
      const originalPost = await PostModel.findOne(req.body, {
        where: { id: req.params.id },
      });

      if (updated) {
        res.status(200).send({ message: "Post updated successfully" });
      } else {
        res.status(404).send({ message: "Post not found" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error updating post", error: error.message });
    }
  },

  /**
   * Delete a post
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deletePost: async (req, res) => {
    try {
      // Logic to delete a post
      const deleted = await Post.destroy({ where: { id: req.params.id } });
      if (deleted) {
        res.status(200).send({ message: "Post deleted successfully" });
      } else {
        res.status(404).send({ message: "Post not found" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error deleting post", error: error.message });
    }
  },
};

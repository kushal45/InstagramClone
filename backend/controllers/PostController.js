const { User, Post, Asset, Comment } = require("../models");
const { PostService } = require("../services");
module.exports = {
  /**
   * Create a new post
   * @param {Object} req - Request object containing post data
   * @param {Object} res - Response object
   */
  createPost: async (req, res) => {
    try {
      const post = await PostService.createPost(req.body,req.userId);
      res.status(201).send({ message: "Post created successfully", post });
    } catch (error) {
      if (error.message === "User not found") {
        res.status(404).send({ message: error.message });
      } else {
        console.log(error);
        res
          .status(500)
          .send({ message: "Error creating post", error: error.message });
      }
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
      const posts = await PostService.listPosts(username);
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
      const post = PostService.getPostById(req.params.id);
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
      const response= await PostService.deletePost(req.params.id);
      res.status(204).send(response);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error deleting post", error: error.message });
    }
  },
};

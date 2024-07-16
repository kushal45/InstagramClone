const { validationResult } = require("express-validator");
const { PostService } = require("../../services");
const { BadRequestError } = require("../../errors");
const { PostDAO } = require("../../dao");
module.exports = {
  /**
   * Create a new post
   * @param {Object} req - Request object containing post data
   * @param {Object} res - Response object
   */
  createPost: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError(JSON.stringify(errors.array()));
      }
      const post = await PostService.createPost(req.body, req.userId);
      res.status(201).send({ message: "Post created successfully", post });
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
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
      const originalPost = await PostDAO.findOne(req.body, {
        where: { id: req.params.id },
      });

      if (updated) {
        res.status(200).send({ message: "Post updated successfully" });
      } else {
        res.status(404).send({ message: "Post not found" });
      }
    } catch (error) {
       throw error;
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
      const response = await PostService.deletePost(req.params.id);
      res.status(204).send(response);
    } catch (error) {
       throw error;
    }
  },
};

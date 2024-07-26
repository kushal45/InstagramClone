const { validationResult } = require("express-validator");
const PostService  = require("../services/PostService");
const { BadRequestError } = require("../../errors");
module.exports = {
  /**
   * Create a new post
   * @param {Object} req - Request object containing post data
   * @param {Object} res - Response object
   */
  createPost: async (req, res,next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError(JSON.stringify(errors.array()));
      }
      const post = await PostService.createPost(req.body, req.userId);
      res.status(201).send({ message: "Post created successfully", post });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all posts
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllPosts: async (req, res,next) => {
    try {
      console.log("get all posts for user",req.userId);
      const userId=req.query.userId;
      const posts = await PostService.listPosts(userId);
      res.status(200).send(posts);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a single post by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getPostById: async (req, res,next) => {
    try {
      const post = PostService.getPostById(req.params.id);
      res.status(200).send(post);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a post
   * @param {Object} req - Request object containing update data
   * @param {Object} res - Response object
   */
  updatePost: async (req, res,next) => {
    try {
      // Logic to update a post
      const response = await PostService.updatePost(req.params.id, req.body);
      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a post
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deletePost: async (req, res,next) => {
    try {
      // Logic to delete a post
      const response = await PostService.deletePost(req.params.id);
      res.status(204).send(response);
    } catch (error) {
      next(error);
    }
  },
};

const { validationResult } = require("express-validator");
const PostService  = require("../services/PostService");
const { BadRequestError } = require("../../errors");
const logger = require("../../logger/logger");
const ResponseFormatter = require("../../util/ResponseFormatter");
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
      res.status(201).json(ResponseFormatter.success(post, 'Post created successfully'));
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  /**
   * Get all posts
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Object} next - Next middleware
   * @returns {Object} - List of posts
   */
  getAllPosts: async (req, res,next) => {
    try {
      //console.log("get all posts for user",req.userId);
      const userId=req.userId;
      const redisClient= req.redis;
      const cursor = req.query.cursor;
      const posts = await PostService.listPosts(userId,redisClient,{cursor});
      res.status(200).json(ResponseFormatter.success(posts, 'Posts retrieved successfully'));
    } catch (error) {
      logger.error(error);
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
      const post = await PostService.getPostById(req.params.id);
      return res.status(200).send(ResponseFormatter.success(post, 'Post retrieved successfully'));
    } catch (error) {
      logger.error(error);  
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
      res.status(200).json(ResponseFormatter.success(post, 'Post updated successfully'));
    } catch (error) {
      logger.error(error);
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
      logger.error(error);
      next(error);
    }
  },
};

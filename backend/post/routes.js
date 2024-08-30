const { Router } = require("express");
const AuthMiddleware = require("../user/middleware/Auth");
const ValidationPost = require("./validations/Post");
const PostController = require("./controllers/PostController");

const routes = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The post ID
 *           example: "1"
 *         asset:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The asset ID
 *               example: "1"
 *             imageUrl:
 *               type: string
 *               description: Url of the image
 *               example: "http://example.com/image.jpg"
 *             videoUrl:
 *               type: string
 *               description: Url of the video
 *               example: "http://example.com/video.mp4"
 *             text:
 *               type: string
 *               description: Content of the asset
 *               example: "This is an image"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the post
 *           example: "2024-07-31T14:45:34.584Z"
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  text:
 *                    type: string
 *                    example: "This is an image"
 *                    description: Content of the post
 *                  imageUrl:
 *                     type: string
 *                     example: "http://example.com/image.jpg"
 *                     description: Url of the image
 *                     optional: true
 *                  videoUrl:
 *                      type: string
 *                      description: Url of video
 *                      example: "http://example.com/video.mp4"
 *                      optional: true
 *                
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
routes.post(
    "",
    AuthMiddleware,
    ValidationPost.validatePost,
    PostController.createPost
  );

  /**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         required: false
 *         description: The cursor for pagination
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 */
  routes.get("", AuthMiddleware, PostController.getAllPosts);

  /**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */
  routes.get("/:id", AuthMiddleware, PostController.getPostById);

  module.exports = routes;
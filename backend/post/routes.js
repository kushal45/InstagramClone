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
 *   schemas:
 *     PostData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the post
 *           example: 50
 *         userId:
 *           type: integer
 *           description: ID of the user who created the post
 *           example: 14
 *         assetId:
 *           type: integer
 *           description: ID of the asset associated with the post
 *           example: 47
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was last updated
 *           example: "2024-08-31T19:04:59.230Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was created
 *           example: "2024-08-31T19:04:59.230Z"
 *     PostResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Status of the response
 *           example: "success"
 *         message:
 *           type: string
 *           description: Message of the response
 *           example: "Post created successfully"
 *         data:
 *           $ref: '#/components/schemas/PostData'
 *         metadata:
 *           type: object
 *           description: Additional metadata
 *           example: {}
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Asset:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the asset
 *           example: 48
 *         imageUrl:
 *           type: string
 *           description: URL of the image
 *           example: "http://example.com/image.jpg"
 *         videoUrl:
 *           type: string
 *           description: URL of the video
 *           example: "http://example.com/video.mp4"
 *         text:
 *           type: string
 *           description: Text description of the asset
 *           example: "This is an image"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the asset
 *           example: ["other"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the asset was created
 *           example: "2024-08-31T19:11:41.760Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the asset was last updated
 *           example: "2024-08-31T19:11:42.612Z"
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the post
 *           example: 51
 *         userId:
 *           type: integer
 *           description: ID of the user who created the post
 *           example: 14
 *         assetId:
 *           type: integer
 *           description: ID of the asset associated with the post
 *           example: 48
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was created
 *           example: "2024-08-31T19:11:41.826Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was last updated
 *           example: "2024-08-31T19:11:41.826Z"
 *         asset:
 *           $ref: '#/components/schemas/Asset'
 *     PostListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Status of the response
 *           example: "success"
 *         message:
 *           type: string
 *           description: Message of the response
 *           example: "Posts retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             posts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *             nextCursor:
 *               type: string
 *               description: Cursor for the next set of results
 *               example: "eJyrVspMUbIysawFAA3AArE"
 *         metadata:
 *           type: object
 *           description: Additional metadata
 *           example: {}
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "<Error message>"
 *                   description: Error message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No authorization"  
 *                   description: Error message
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
 *               $ref: '#/components/schemas/PostListResponse'
 *       401:
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No authorization"  
 *                   description: Error message
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
 *               $ref: '#/components/schemas/PostResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Post not Found"
 *                   description: Error message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No authorization"
 *                   description: Error message
 */
  routes.get("/:id", AuthMiddleware, PostController.getPostById);

  module.exports = routes;
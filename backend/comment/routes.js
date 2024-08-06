const { Router } = require("express");
const AuthMiddleware = require("../user/middleware/Auth");
const ValidationComment = require("./validations/Comment");
const CommentController = require("./controllers/CommentController");

const routes = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *                 example: "1"
 *               postId:
 *                 type: string
 *                 description: The ID of the post
 *                 example: "1"
 *               imageUrl:
 *                 type: string
 *                 description: The URL of the image
 *                 example: "http://example.com/image.jpg"
 *                 optional: true
 *               videoUrl:
 *                 type: string
 *                 description: The URL of the video
 *                 example: "http://example.com/video.mp4"
 *                 optional: true
 *               text:
 *                 type: string
 *                 description: The content of the comment
 *                 example: "This is a comment"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
routes.post(
    "",
    AuthMiddleware,
    ValidationComment.validateComment,
    CommentController.create
  );

  /**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       404:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 */
  routes.get("/:id", AuthMiddleware, CommentController.getById);

  module.exports = routes;
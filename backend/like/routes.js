const { Router } = require("express");
const AuthMiddleware= require('../user/middleware/Auth');
const ValidationLike= require('./validations/Like');
const LikeController= require('./controllers/LikeController');

const routes = Router();
/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API for managing likes
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
 *     Like:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The like ID
 *           example: "1"
 *         postId:
 *           type: string
 *           description: Id of the post that was liked
 *           example: "1"
 *         count:
 *           type: integer
 *           description: Number of likes
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the like
 *           example: "2024-07-31T14:45:34.584Z"
 */

/**
 * @swagger
 * /like:
 *   post:
 *     summary: Like a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Post liked successfully
 *       401:
 *         description: Unauthorized
 */
routes.post(
    "",
    AuthMiddleware,
    LikeController.like
  );
  
/**
 * @swagger
 * /like/unlike:
 *   put:
 *     summary: Unlike a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
  routes.put(
    "/unlike",
    AuthMiddleware,
    ValidationLike.validateLike,
    LikeController.unlike
  );
  /**
 * @swagger
 * /like:
 *   get:
 *     summary: Show likes of post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Likes retrieved successfully
 *       401:
 *         description: Unauthorized
 */
  routes.get("", AuthMiddleware, LikeController.show);
  /**
 * @swagger
 * /like:
 *   delete:
 *     summary: Delete a like
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Like deleted successfully
 *       401:
 *         description: Unauthorized
 */
  routes.delete("", AuthMiddleware, LikeController.delete);

  module.exports = routes;
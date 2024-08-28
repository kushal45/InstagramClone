const express = require('express');
const FollowerController = require('./controllers/FollowerController');
const AuthMiddleware = require('../user/middleware/Auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Follow users
 *   description: API for managing followings of users
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
 * /users/{userId}/following:
 *   get:
 *     summary: List users that a specific user is following
 *     tags: [Follow users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         required: false
 *         description: The cursor for pagination
 *     responses:
 *       200:
 *         description: List of users that the specified user is following
 *       401:
 *         description: Unauthorized
 */
router.get('/:userId/following',AuthMiddleware, FollowerController.listFollowing);

/**
 * @swagger
 * /users/{userId}/follow:
 *   post:
 *     summary: Follow another user
 *     tags: [Follow users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User followed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/:userId/follow',AuthMiddleware, FollowerController.followUser);

/**
 * @swagger
 * /users/{userId}/unfollow:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Follow users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:userId/unfollow', AuthMiddleware,FollowerController.unfollowUser);

module.exports = router;
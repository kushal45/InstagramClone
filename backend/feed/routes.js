//create routes for getFeeds and sharePost

const { Router } = require("express");
const FeedController = require("./controller/FeedController");
const AuthMiddleware = require("../user/middleware/Auth");
const {validateGetFeeds,validateSharePost} = require("./validation/Feed");

const routes = Router();

/**
 * @swagger
 * tags:
 *   name: Feeds
 *   description: API for managing feeds
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
 *     Feed:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The feed ID
 *           example: "1"
 *         userId:
 *           type: string
 *           description: Id of the user who created the feed
 *           example: "1"
 *         assetId:
 *           type: string
 *           description: Id of the asset
 *           example: "1"
 *         asset:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Id of the asset
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
 *           description: The creation date of the feed
 *           example: "2024-07-31T14:45:34.584Z"
 */


/**
 * @swagger
 * /feeds:
 *   get:
 *     summary: Get all feeds
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feeds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       401:
 *         description: Unauthorized
 */
routes.get("", AuthMiddleware, FeedController.getFeeds);

/**
 * @swagger
 * /feeds/share:
 *   post:
 *     summary: Share a new post
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Post shared successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
routes.post("/share", AuthMiddleware,validateSharePost, FeedController.sharePost);

module.exports = routes;
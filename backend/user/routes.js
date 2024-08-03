const { Router } = require("express");
const AuthMiddleware = require("./middleware/Auth");
const RedisMiddleware = require("../middleware/Redis");
const CacheHowiam = require("../middleware/RedisCache");
const ValidationAuth= require("./validations/Auth");
const ValidationsUser = require("./validations/User");
const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");

const routes = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
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
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user1"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
routes.post("/login", ValidationAuth.login, AuthController.login);

/**
 * @swagger
 * /user/howIam:
 *   get:
 *     summary: Get authenticated user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Unauthorized
 */
routes.get(
  "/howIam",
  AuthMiddleware,
  CacheHowiam,
  AuthController.howIam
);


/**
 * @swagger
 * /user/{username}:
 *   get:
 *     summary: Get user by username
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
routes.get("/:username", AuthMiddleware, UserController.show);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user1"
 *               name:
 *                 type: string
 *                 example: "User One"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               email:
 *                 type: string
 *                 example: "user1@example.com"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
routes.post("/register", ValidationsUser.withPassword, UserController.store);

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user1@gmail.com"
 *               name:
 *                 type: string
 *                 example: "User One"
 *               bio:
 *                 type: string
 *                 example: "I am a user"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "sports"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
routes.put(
  "/update",
  AuthMiddleware,
  ValidationsUser.withoutPassword,
  UserController.update
);

/**
 * @swagger
 * /user/password:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
routes.put(
  "/password",
  AuthMiddleware,
  ValidationsUser.password,
  UserController.updatePassword
);

module.exports = routes;

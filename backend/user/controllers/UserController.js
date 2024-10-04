const { validationResult } = require("express-validator");
const  UserService  = require("../services/UserService");
const { NotFoundError } = require("../../errors");
const logger = require("../../logger/logger");
const ResponseFormatter = require("../../util/ResponseFormatter");

module.exports = {
  async show(req, res,next) {
    try {
      const { username } = req.params;
      const result = await UserService.getUserProfile(username, req.userId);
      return res.status(200).send(ResponseFormatter.success(result.body, "User profile retrieved successfully"));
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  async store(req, res,next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new NotFoundError(JSON.stringify(errors.array()));
      const { username, password, name, email } = req.body;
      const userData = { username, password, name };
      if (email) userData.email = email;
      const result = await UserService.registerUser(userData);
      return res.status(201).json(result.body);
    } catch (error) {
     logger.error(error);
     next(error);
    }
  },

  async update(req, res,next) {
    try {
      const response = await UserService.updateUserProfile(
        req.userId,
        req.body
      );
      res.status(200).json(response);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async updatePassword(req, res,next) {
    try {
      const { password_old, password, password_confirm } = req.body;
      const response = await UserService.updatePassword(
       {
          userId: req.userId,
          passwordOld: password_old,
          password,
          passwordConfirm: password_confirm,
       }
      );
      res.json(response);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  async search(req, res,next) {
    try {
      logger.info("Searching for users");
      const query = req.query.q;
      logger.info("Searching for users with query:", query);
      const result = await UserService.search(query);
      logger.info("Search results retrieved successfully");
      const response= ResponseFormatter.success(result, "Search results retrieved successfully");
      return res.status(200).send(response);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
};

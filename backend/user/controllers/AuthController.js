const { validationResult } = require("express-validator");
const UserService = require("../services/UserService");
const logger = require("../../logger/logger");

module.exports = {
  async howIam(req, res,next) {
    try {
      console.log("Fetching data...");
      const user = await UserService.getUserById(req.userId, {
        attributes: ["id", "username", "name", "avatar_url"],
      });
  
      req.redis.setex(req.userId, 3600, JSON.stringify(user));
  
      return res.json(user);
    } catch (error) {
       logger.error(error);
       next(error)
    }
   
  },

  async login(req, res,next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new NotFoundError(JSON.stringify(errors.array()));
      const result = await UserService.login(req.body.username, req.body.password);
      return res.status(200).json(result.body);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};

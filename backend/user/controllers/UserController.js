const  UserService  = require("../services/UserService");

module.exports = {
  async show(req, res,next) {
    try {
      const { username } = req.params;
      const result = await UserService.getUserProfile(username, req.userId);
      return res.status(200).send(result.body);
    } catch (error) {
      next(error);
    }
  },

  async store(req, res,next) {
    try {
      const result = await UserService.registerUser(req);
      return res.status(201).json(result.body);
    } catch (error) {
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
      console.log(error);
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
      next(error);
    }
  },
};

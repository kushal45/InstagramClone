const  UserService  = require("../services/UserService");

module.exports = {
  async show(req, res) {
    try {
      const { username } = req.params;
      const result = await UserService.getUserProfile(username, req.userId);
      return res.status(200).send(result.body);
    } catch (error) {
      throw error;
    }
  },

  async store(req, res) {
    try {
      const result = await UserService.registerUser(req);
      return res.status(201).json(result.body);
    } catch (error) {
     throw error;
    }
  },

  async update(req, res) {
    try {
      const response = await UserService.updateUserProfile(
        req.userId,
        req.body
      );
      res.json(response);
    } catch (error) {
     throw error;
    }
  },
  async updatePassword(req, res) {
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
      throw error;
    }
  },
};

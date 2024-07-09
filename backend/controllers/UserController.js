const Sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserService } = require("../services");
//const Photo = require("../models/Photo");
//const Follow = require("../models/Follow");

module.exports = {
  async show(req, res) {
    try {
      const { username } = req.params;
      const result = await UserService.getUserProfile(username, req.userId);

      if (result.status !== 200) {
        return res.status(result.status).send(result.body);
      }

      res.json(result.body);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  async store(req, res) {
    try {
      const result = await UserService.registerUser(req);
      if (result.status !== 200) {
        return res.status(result.status).json(result.body);
      }
      res.json(result.body);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const response = await UserService.updateUserProfile(req.userId, req.body);
    res.json(response);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async updatePassword(req, res) {
    try {
      const { password_old, password, password_confirm } = req.body;
      const response = await UserService.updatePassword(
        req.user,
        password,
        password_old,
        password_confirm
      );

      res.json(response);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
};

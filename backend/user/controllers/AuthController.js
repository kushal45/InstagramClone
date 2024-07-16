const UserService = require("../services/UserService");

module.exports = {
  async howIam(req, res) {
    console.log("Fetching data...");
    const user = await UserService.getUserById(req.userId, {
      attributes: ["id", "username", "name", "avatar_url"],
    });

    req.redis.setex(req.userId, 3600, JSON.stringify(user));

    return res.json(user);
  },

  async login(req, res) {
    try {
      const result = await UserService.login(req);

      return res.status(200).json(result.body);
    } catch (error) {
      console.error(error);
    }
  },
};

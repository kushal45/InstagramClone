const User = require("../models/User");
const UserService = require("../services/UserService");

module.exports = {
    async howIam(req, res) {
        console.log("Fetching data...");
        const user = await User.findByPk(req.userId, {
            attributes: ["id", "username", "name", "avatar_url"]
        });

        req.redis.setex(req.userId, 3600, JSON.stringify(user));

        return res.json(user);
    },

    async login(req, res) {
        try {
            const result = await UserService.login(req);
            if (result.status !== 200) {
                return res.status(result.status).json(result.body);
            }
            return res.status(200).json(result.body);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "Server error" });
        }
    }
};
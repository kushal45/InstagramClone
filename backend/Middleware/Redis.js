require("dotenv").config();

const redis = require("redis");

const REDIS_PORT = process.env.REDIS_PORT || 6379; // Config port of redis
const client = redis.createClient(REDIS_PORT);

module.exports = (req, res, next) => {
    req.redis = client;
    next();
};
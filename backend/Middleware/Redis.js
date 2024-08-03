require("dotenv").config();

const redis = require("redis");

const REDIS_PORT = process.env.REDIS_PORT; // Config port of redis
console.log("redis connection to be initiated");
console.log("REDIS_PORT", REDIS_PORT);
console.log("REDIS_HOST", process.env.REDIS_HOST);
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || "redis"}:${
    process.env.REDIS_PORT || 6379
  }`,
});

client.on("error", (err) => {
  console.error("Redis client error:", err);
});
client.connect();

client.on("ready", () => {
  console.log("Redis client connected");
});

module.exports = (req, res, next) => {
  req.redis = client;
  next();
};

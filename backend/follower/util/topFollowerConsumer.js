const redis = require("redis");
const Metrics = require("../../util/Metrics");
const FollowerService = require("../services/FollowerService");
const logger = require("../../logger/logger");
const viewFollowerResult = require("./viewFollowerResult");

const options = {
  endpoint: "topFollowerConsumer",
  method: "consumer",
  status_code: 200,
  response_time_ms: 0,
};

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
redisClient.connect();

async function topFollowerConsumer(kafaConsumerInst) {
  kafaConsumerInst.processMessage(async (followerObj) => {
    const start = process.hrtime();
    await viewFollowerResult(redisClient,"topUsers");
    const metrics = new Metrics();
    const durationMs = metrics.fetchDurationMs(start);
    options.response_time_ms = durationMs;
    await metrics.capture(options);
  });
}

module.exports = topFollowerConsumer;

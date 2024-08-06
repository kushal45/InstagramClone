const redis = require("redis");
const Metrics = require("../../util/Metrics");
const FollowerService = require("../services/FollowerService");

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
    console.log("topFollowerConsumer running called with", followerObj);
    const topFollowers = await fetchTopFollower(
      followerObj.numberOfTopFollowers,
      redisClient
    );
    console.log(
      `top ${followerObj.numberOfTopFollowers}:`,
      JSON.stringify(topFollowers)
    );
    const metrics = new Metrics();
    const durationMs = metrics.fetchDurationMs(start);
    options.response_time_ms = durationMs;
    metrics.capture(options);
  });
}

async function fetchTopFollower(numList, redisClient) {
  const topFollowers = FollowerService.getTopUsersByFollowers(
    numList,
    redisClient
  );
  return topFollowers;
}

module.exports = topFollowerConsumer;

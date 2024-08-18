require("dotenv").config();
const FollowerDao = require("../dao/FollowerDao");
const redis = require("redis");
const viewFollowerResult = require("./viewFollowerResult");


async function getTopFollowers(numList) {
  console.log(
    "Getting top followers",
    numList,
    process.env.REDIS_HOST,
    process.env.REDIS_PORT
  );
  const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });
  redisClient.connect();
  
  const keyExists = await redisClient.exists("topUsers");
  if (keyExists) {
    await redisClient.del("topUsers");
    console.log("Deleted existing sorted set key: topUsers");
  }
  const topUsers = await FollowerDao.getTopUsersByFollowers(numList);
  console.log("Top users by followers: ", topUsers);
  for (const user of topUsers) {
    await redisClient.zAdd("topUsers", {
      score: user.followerCount,
      value: user.name,
    });
  }



  await viewFollowerResult(redisClient, "topUsers");
  redisClient.disconnect();
}

getTopFollowers(process.env.TOP_USER_FOLLOWERLIST)
  .then(() => {
    console.log("Top followers added to redis");
  })
  .catch((error) => {
    console.log("Error adding top followers to redis");
    console.error(error);
  });

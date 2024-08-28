const FollowerDao = require("../dao/FollowerDao");
const KafkaProducer = require("../../kafka/Producer");
const httpContext = require("express-http-context");
const logger = require("../../logger/logger");


class FollowerService {
  // List followers of a user
  static async listFollowers(userId,redisClient,{
    cursor,
    pageSize,
  }={
    cursor: "",
    pageSize: 10,
  }) {
    try {
      const cachedKey = `followers:${userId}:${cursor}`;
      const cachedFollowers = await redisClient.get(cachedKey);
      if (cachedFollowers) {
        return JSON.parse(cachedFollowers);
      }
      logger.debug("current cursor", cursor);
      const followers = await FollowerDao.listFollowers(userId,{ cursor, pageSize });
      redisClient.set(cachedKey, JSON.stringify(followers), "EX", 3600); // Cache for 1 hour
      return followers;
    } catch (error) {
      throw error;
    }
  }

  // List users that a specific user is following
  static async listFollowing(userId,redisClient,{ cursor ,pageSize} = {
    cursor: "",
    pageSize: 10,
  }) {
    try {
      const cachedKey = `following:${userId}:${cursor}`;
     // const cachedFollowing = await redisClient.get(cachedKey);
      // if (cachedFollowing) {
      //   return JSON.parse(cachedFollowing);
      // }
      logger.debug("current cursor", cursor);
      const paginatedFollowings = await FollowerDao.listFollowing(userId,{ cursor, pageSize });
      redisClient.set(cachedKey, JSON.stringify(paginatedFollowings), "EX", 3600); // Cache for 1 hour
      return paginatedFollowings;
    } catch (error) {
      throw error;
    }
  }

  // Follow another user
  static async followUser(followerId, followingId,redisClient) {
    try {
      const createdFollower = await FollowerDao.addFollower(followerId, followingId);
      const kafkaProducer = new KafkaProducer("producer-2");
      const correlationId= httpContext.get("correlationId");
      logger.debug("following info", createdFollower);
      await redisClient.zIncrBy('topUsers', 1, createdFollower.FollowingUser.name);
      await kafkaProducer.produce("followerCreated", { numberOfTopFollowers: process.env.TOP_USER_FOLLOWERLIST}, { correlationId });
      return createdFollower;
    } catch (error) {
      const dlqTopic = "dlQFollowerCreated"; 
      const kafkaProducerInst = new KafkaProducer("dlQProducer2");
      const correlationId = httpContext.get("correlationId");
      await kafkaProducerInst.produce(
        dlqTopic,
        { message: error.message },
        { correlationId }
      );
      throw error;
    }
  }

  // Get top users by followers
  static async getTopUsersByFollowers(numList,redisClient) {
    try {
      const cacheKey = 'topUsersByFollowers';
      const cachedTopUsers = await redisClient.get(cacheKey);
      if (cachedTopUsers) {
        return JSON.parse(cachedTopUsers);
      }
      const topUsers = await FollowerDao.getTopUsersByFollowers(numList);
      redisClient.set(cacheKey, JSON.stringify(topUsers), 'EX', 5); // Cache for 1 hour
      return topUsers;
    } catch (error) {
      throw error;
    }
  }

    // Unfollow a user
    static async unfollowUser(followerId, followingId) {
      try {
        await FollowerDao.removeFollower(followerId, followingId);
        return { message: "Unfollowed successfully" };
      } catch (error) {
        throw error;
      }
    }
}

module.exports =  FollowerService;
const FollowerDao = require("../dao/FollowerDao");
const KafkaProducer = require("../../kafka/Producer");
const httpContext = require("express-http-context");


class FollowerService {
  // List followers of a user
  static async listFollowers(userId) {
    try {
      const followers = await FollowerDao.listFollowers(userId);
      return followers;
    } catch (error) {
      throw error;
    }
  }

  // List users that a specific user is following
  static async listFollowing(userId) {
    try {
      const following = await FollowerDao.listFollowing(userId);
      return following;
    } catch (error) {
      throw error;
    }
  }

  // Follow another user
  static async followUser(followerId, followingId) {
    try {
      const createdFollower = await FollowerDao.addFollower(followerId, followingId)
      const kafkaProducer = new KafkaProducer();
      const correlationId= httpContext.get("correlationId");
      await kafkaProducer.produce("followerCreated", { numberOfTopFollowers: process.env.TOP_USER_FOLLOWERLIST }, { correlationId });
      return createdFollower;
    } catch (error) {
      throw error;
    }
  }

  // Get top users by followers
  static async getTopUsersByFollowers(numList) {
    try {
      const topUsers = await FollowerDao.getTopUsersByFollowers(numList);
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
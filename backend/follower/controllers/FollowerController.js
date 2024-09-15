const FollowerService = require("../services/FollowerService");
const logger = require("../../logger/logger");

class FollowerController {
  // List followers of a user
  static async listFollowers(req, res, next) {
    try {
      const redisClient = req.redis;
      const cursor = req.query.cursor;
      const followers = await FollowerService.listFollowers(
        req.params.userId,
        redisClient,
        { cursor }
      );
      res.json(followers);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  // List users that a specific user is following
  static async listFollowing(req, res, next) {
    try {
      const cursor = req.query.cursor;
      const redisClient = req.redis;
      const following = await FollowerService.listFollowing(
        req.params.userId,
        redisClient,
        {
          cursor,
        }
      );
      res.status(200).json(following);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  // Follow another user
  static async followUser(req, res, next) {
    try {
      const followingId = req.params.userId;
      const redisClient = req.redis;
      await FollowerService.followUser(req.userId, followingId, redisClient);
      res.status(201).send("Followed successfully.");
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  // Unfollow a user
  static async unfollowUser(req, res, next) {
    try {
      const followingId = req.params.userId;
      await FollowerService.unfollowUser(req.userId, followingId);
      res.send("Unfollowed successfully.");
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
}

module.exports = FollowerController;

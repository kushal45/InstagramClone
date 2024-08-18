const FollowerService = require('../services/FollowerService');
const logger = require('../../logger/logger');

class FollowerController {
  // List followers of a user
  static async listFollowers(req, res,next) {
    try {
      const redisClient = req.redis;
      const followers=await FollowerService.listFollowers(req.params.userId,redisClient);
      res.json(followers);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  // List users that a specific user is following
  static async listFollowing(req, res,next) {
    try {
      const redisClient = req.redis;
      const following = await FollowerService.listFollowing(req.params.userId,redisClient);
      res.status(200).json(following);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  // Follow another user
  static async followUser(req, res,next) {
    try {
      const followingId = req.params.userId;
      const redisClient= req.redis;
      await FollowerService.followUser(req.userId, followingId,redisClient);
      res.status(201).send('Followed successfully.');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Unfollow a user
  static async unfollowUser(req, res,next) {
    try {
      const followingId = req.params.userId;
      await FollowerService.unfollowUser(req.userId, followingId);
      res.send('Unfollowed successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FollowerController;
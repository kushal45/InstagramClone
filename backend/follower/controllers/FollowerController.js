const FollowerService = require('../services/FollowerService');

class FollowerController {
  // List followers of a user
  async listFollowers(req, res,next) {
    try {
      const followers=await FollowerService.listFollowers(req.params.userId);
      res.json(followers);
    } catch (error) {
      next(error);
    }
  }

  // List users that a specific user is following
  async listFollowing(req, res,next) {
    try {
      const following = await FollowerService.listFollowing(req.params.userId);
      res.status(200).json(following);
    } catch (error) {
      next(error);
    }
  }

  // Follow another user
  async followUser(req, res,next) {
    try {
      const followingId = req.params.userId;
      await FollowerService.followUser(req.userId, followingId);
      res.status(201).send('Followed successfully.');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Unfollow a user
  async unfollowUser(req, res,next) {
    try {
      const followingId = req.params.userId;
      await FollowerService.unfollowUser(req.userId, followingId);
      res.send('Unfollowed successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FollowerController();
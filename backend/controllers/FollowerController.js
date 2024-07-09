const { Follower, User } = require('../models');

class FollowerController {
  // List followers of a user
  async listFollowers(req, res) {
    try {
      const userId = req.params.userId;
      const followers = await Follower.findAll({
        where: { followingId: userId },
        include: [{ model: User, as: 'FollowerDetails' }]
      });
      res.json(followers);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }

  // List users that a specific user is following
  async listFollowing(req, res) {
    try {
      const userId = req.params.userId;
      const following = await Follower.findAll({
        where: { followerId: userId },
        include: [{ model: User, as: 'FollowingDetails' }]
      });
      res.json(following);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }

  // Follow another user
  async followUser(req, res) {
    try {
      const { followingId } = req.body;
      const followerId = req.userId;
      const exists = await Follower.findOne({ where: { followerId, followingId } });
      if (exists) {
        return res.status(400).send('Already following this user.');
      }
      await Follower.create({ followerId, followingId });
      res.status(201).send('Followed successfully.');
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }
}

module.exports = new FollowerController();
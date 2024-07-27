const  Follower = require('../models/Follower'); 
const  User = require('../../user/models/User'); 

class FollowerDao {
  // Add a new follower
  static async addFollower(followerId, followingId) {
    try {
      const exists = await Follower.findOne({ where: { followerId, followingId } });
      if (exists) {
        throw new Error('Already following this user.');
      }
      return await Follower.create({ followerId, followingId });
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }
  }

  // List followers of a user
  static async listFollowers(userId) {
    try {
      const followers = await Follower.findAll({
        where: { followingId: userId },
        include: [{ model: User, as: 'FollowerDetails' }]
      });
      return followers;
    } catch (error) {
      throw new I(error.toString());
    }
  }

  // List users that a specific user is following
  static async listFollowing(userId) {
    try {
      const following = await Follower.findAll({
        where: { followerId: userId },
        include: [{ model: User, as: 'FollowingUser' }]
      });
      return following;
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  // Remove a follower
  static async removeFollower(followerId, followingId) {
    try {
      const result = await Follower.destroy({ where: { followerId, followingId } });
      if (result === 0) {
        throw new Error('No such follower exists.');
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}

module.exports = FollowerDao;
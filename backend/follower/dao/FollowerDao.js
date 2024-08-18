const  Follower = require('../models/Follower'); 
const  User = require('../../user/models/User'); 
const { Sequelize } = require('sequelize');
const FollowerPool = require('../models/FollowerPool');

class FollowerDao {
  // Add a new follower
  static async addFollower(followerId, followingId) {
    try {
      const exists = await Follower.findOne({ where: { followerId, followingId } });
      if (exists) {
        throw new Error('Already following this user.');
      }
     const follower= await Follower.create(
      { followerId, followingId },
      {
        include: [
          { model: User, as: 'FollowerUser' },
          { model: User, as: 'FollowingUser' }
        ]
      }
    );
     return await Follower.findOne({
        where: { id: follower.id },
        include: [
          { model: User, as: 'FollowerUser' },
          { model: User, as: 'FollowingUser' }
        ]
      });
      //return await FollowerPool.insertFollower({followerId, followingId});
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }
  }

  // List followers of a user
  static async listFollowers(userId) {
    try {
      // const followers = await Follower.findAll({
      //   where: { followingId: userId },
      //   include: [{ model: User, as: 'FollowerDetails' }]
      // });
      const followers = await FollowerPool.fetchFollowersByUserId(userId);
      return followers;
    } catch (error) {
      throw new I(error.toString());
    }
  }

  static async getTopUsersByFollowers(numList) {
    try {
      // const topUsers = await Follower.findAll({
      //   attributes: [
      //     'followingId',
      //     [Sequelize.fn('COUNT', Sequelize.col('followerId')), 'followerCount'],
      //     'FollowingUser.id',
      //     'FollowingUser.name',
      //     'FollowingUser.email',
      //     'FollowingUser.username',
      //     'FollowingUser.password',
      //     'FollowingUser.avatarUrl',
      //     'FollowingUser.bio',
      //     'FollowingUser.website',
      //     'FollowingUser.phone',
      //     'FollowingUser.tags',
      //     'FollowingUser.langPrefs',
      //     'FollowingUser.createdAt',
      //     'FollowingUser.updatedAt'
      //   ],
      //   group: [
      //     'followingId',
      //     'FollowingUser.id',
      //     'FollowingUser.name',
      //     'FollowingUser.email',
      //     'FollowingUser.username',
      //     'FollowingUser.password',
      //     'FollowingUser.avatarUrl',
      //     'FollowingUser.bio',
      //     'FollowingUser.website',
      //     'FollowingUser.phone',
      //     'FollowingUser.tags',
      //     'FollowingUser.langPrefs',
      //     'FollowingUser.createdAt',
      //     'FollowingUser.updatedAt'
      //   ],
      //   order: [[Sequelize.literal('"followerCount"'), 'DESC']],
      //   limit: numList,
      //   include: [{ model: User, as: 'FollowingUser' }]
      // });
      const topUsers = await FollowerPool.getTopUsersByFollowers(numList);
      return topUsers;
    } catch (error) {
      throw error;
    }
  }

  // List users that a specific user is following
  static async listFollowing(userId) {
    try {
      // const following = await Follower.findAll({
      //   where: { followerId: userId },
      //   include: [{ model: User, as: 'FollowingUser' }]
      // });
      const following = await FollowerPool.fetchFollowingListByFollowerId(userId);
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
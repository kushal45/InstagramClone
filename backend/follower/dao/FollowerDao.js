const Follower = require("../models/Follower");
const User = require("../../user/models/User");
const { Sequelize } = require("sequelize");
const FollowerPool = require("../models/FollowerPool");
const Cursor = require("../../database/cursor");
const Logger = require("../../logger/logger");
const { fetchLastCursor } = require("../../util/Utility");

class FollowerDao {
  // Add a new follower
  static async addFollower(followerId, followingId) {
    try {
      const exists = await Follower.findOne({
        where: { followerId, followingId },
      });
      if (exists) {
        throw new Error("Already following this user.");
      }
      const follower = await Follower.create(
        { followerId, followingId },
      );
      return await Follower.findOne({
        where: { id: follower.id },
        include: [
          { model: User, as: "FollowerUser" },
          { model: User, as: "FollowingUser" },
        ],
      });
      //return await FollowerPool.insertFollower({followerId, followingId});
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }
  }

  // List followers of a user
  static async listFollowers(userId, { cursor, pageSize }) {
    try {
      const where = {
        followingId: userId,
      };
      if (cursor) {
        const decodedCursor = Cursor.decode(cursor);
        where.id = {
          [Sequelize.Op.gt]: decodedCursor,
        };
      }
      const followers = await Follower.findAll({
        where,
        include: [{ model: User, as: "FollowerDetails", attributes: ["id", "name", "email"] }],
        limit: pageSize,
        order: [["id", "ASC"]],
      });
      const nextCursor=fetchLastCursor(followers);
      return {
        followers,
        nextCursor,
      };
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

  /**
   *
   * @param {*} userId
   * @param {*} { cursor, pageSize}
   * @returns object containing followings and next cursor
   */
  static async listFollowing(
    userId,
    { cursor, pageSize } = { cursor: "", pageSize: 10 }
  ) {
    try {
      const where = {
        followerId: userId,
      };
      if (cursor) {
        const decodedCursor = Cursor.decode(cursor);
        Logger.debug("Decoded cursor", decodedCursor);
        where.id = {
          [Sequelize.Op.gt]: decodedCursor.id,
        };
      }
      const followings = await Follower.findAll({
        where,
        include: [{ model: User, as: "FollowingUser", attributes: ["id","name"] }],
        order: [["id", "ASC"]],
        limit: pageSize,
      });
      const newFollowingCursor = fetchLastCursor(followings);
      return { followings, nextCursor: newFollowingCursor };
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  // Remove a follower
  static async removeFollower(followerId, followingId) {
    try {
      const result = await Follower.destroy({
        where: { followerId, followingId },
      });
      if (result === 0) {
        throw new Error("No such follower exists.");
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}

module.exports = FollowerDao;

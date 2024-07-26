const FollowerDao = require("../dao/FollowerDao");


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
      return createdFollower;
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
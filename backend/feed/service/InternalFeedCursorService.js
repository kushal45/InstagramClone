const FollowerService = require("../../follower/services/FollowerService");
const PostService = require("../../post/services/PostService");

/**
 * Fetches posts by tags.
 *
 * @param {Array<string>} tags - The tags to filter posts by.
 * @param {string} cursor - The cursor for pagination.
 * @param {string} sortOrder - The sort order.
 * @returns {Promise<Object>} - The posts and the next cursor.
 */
async function fetchPostsByTags(tags, cursor, sortOrder) {
  return await PostService.listPostsByAttr({ tags, cursor, sortOrder });
}

/**
 * Fetches followings and their posts.
 *
 * @param {string} userId - The user ID.
 * @param {string} cursor - The cursor for pagination.
 * @param {string} sortOrder - The sort order.
 * @param {Object} redisClient - The Redis client instance.
 * @returns {Promise<Object>} - The followings, their posts, and the next cursors.
 */
async function fetchFollowingsAndPosts(userId, cursor, sortOrder, redisClient) {
  const { followings, nextCursor: newFollowingCursor } = await FollowerService.listFollowing(userId, redisClient, { cursor });
  const followingIds = followings.map(following => following.followingId);
  const { posts: postWithFollowings, nextCursor: newPostFollowingCursor } = await PostService.listPostsByUserIds(followingIds, { cursor, sortOrder });
  return { followings, postWithFollowings, newFollowingCursor, newPostFollowingCursor };
}

module.exports = {
  fetchPostsByTags,
  fetchFollowingsAndPosts,
};
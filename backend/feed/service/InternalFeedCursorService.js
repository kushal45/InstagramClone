const { fetchDecodedCursor } = require("../../util/Utility");
const Cursor = require("../../database/cursor");
const FollowerService = require("../../follower/services/FollowerService");
const PostService = require("../../post/services/PostService");
const logger = require("../../logger/logger");

/**
 * Fetches feeds of posts based on user tags and followings, and updates the cache.
 * 
 * @param {Object} params - The parameters for fetching feeds.
 * @param {Array<string>} params.userTags - The tags associated with the user.
 * @param {Object} params.decodedRes - The decoded response containing cursors.
 * @param {string} params.sortOrder - The order in which to sort the posts.
 * @param {string} params.userId - The ID of the user.
 * @param {Object} params.redisClient - The Redis client for caching.
 * @param {string} params.cacheKey - The key to use for caching the result.
 * @returns {Promise<Object>} - The result containing the fetched feeds and the new cursor.
 */
async function fetchFeedsOfPost({
  userTags,
  decodedRes,
  sortOrder,
  userId,
  redisClient,
  cacheKey,
}) {
  /**
   * query posts by tags which uses GIN index internally on tags column of Assets table
   */
  const { postWithTags, newPostTagsCursor } = await fetchPostsByTags({
    tags: userTags,
    cursor: decodedRes?.postTagsCursor,
    sortOrder,
  });
  const { postWithFollowings, newPostWithFollowingCursor } =
    await fetchFollowingsAndPosts({
      userId,
      cursor: decodedRes?.postFollowingCursor,
      sortOrder,
      redisClient,
    });
  const result = [...postWithTags, ...postWithFollowings];
  await redisClient.hSet(cacheKey, "data", JSON.stringify(result));
  await redisClient.hSet(cacheKey, "timestamp", Date.now().toString());
  await redisClient.expire(cacheKey, 36); // Set expiration time to 36 seconds
  return {
    data: result,
    cursor: Cursor.encode({
      postFollowingCursor: newPostWithFollowingCursor,
      postTagsCursor: newPostTagsCursor,
    }),
  };
}
/**
 * Decodes the provided cursor string.
 *
 * @param {string} cursor - The opaque cursor string or an empty string.
 * @returns {Object|null} - The decoded cursor object or null if the cursor is an empty string.
 *                          The response object contains:
 *                          - {string} postTagsCursor: The cursor for post tags.
 *                          - {string} postFollowingCursor: The cursor for post followings.
 */
function fetchParentDecodedCursor(cursor) {
  const decodeCursor = fetchDecodedCursor(cursor);
  if (decodeCursor != null) {
    return {
      postTagsCursor: decodeCursor.postTagsCursor,
      postFollowingCursor: decodeCursor.postFollowingCursor,
    };
  }
  return null;
}
/**
 * Fetches posts by tags.
 *
 * @param {Array<string>} tags - The tags to filter posts by.
 * @param {string} cursor - The cursor for pagination.
 * @param {string} sortOrder - The sort order.
 * @returns {Promise<Object>} - The posts and the next cursor.
 */
async function fetchPostsByTags({ tags, cursor, sortOrder }) {
  let postTagsCursor = null;
  if (cursor != null) {
    const decodedCursor = fetchDecodedCursor(cursor);
    if (decodedCursor != null) {
      postTagsCursor = decodedCursor.postTagsCursor;
    }
  }
  const postResults = await PostService.listPostsByAttr(
    { tags },
    undefined,
    {
      cursor: postTagsCursor,
      sortOrder,
    }
  );
  return {
    postWithTags: postResults.postWithTags,
    newPostTagsCursor: postResults.nextCursor,
  };
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
async function fetchFollowingsAndPosts({
  userId,
  cursor,
  sortOrder,
  redisClient,
}) {
  let followingCursor = null;
  let userFollowingPosts = null;
  if (cursor != null) {
    const decodedCursor = decodePostFollowingCursor(cursor);
    if (decodedCursor != null) {
      followingCursor = decodedCursor.followingCursor;
      userFollowingPosts = decodedCursor.userFollowingPosts;
    }
  }
  const { followings, nextCursor: newFollowingCursor } =
    await FollowerService.listFollowing(userId, redisClient, {
      cursor: followingCursor,
    });
  const followingIds = followings.map((following) => following.followingId);
  const { posts: postWithFollowings, nextCursor: newUserFollowingPosts } =
    await PostService.listPostsByUserIds(followingIds, {
      cursor: userFollowingPosts,
      sortOrder,
    });

  const newPostWithFollowingCursor = Cursor.encode({
    followingCursor: newFollowingCursor,
    userFollowingPostsCursor: newUserFollowingPosts,
  });
  return { postWithFollowings, newPostWithFollowingCursor };
}

function decodePostFollowingCursor(cursor) {
  const decodedCursor = fetchDecodedCursor(cursor);
  if (decodedCursor != null) {
    return {
      followingCursor: decodedCursor.followingCursor,
      userFollowingPosts: decodedCursor.userFollowing,
    };
  }
  return null;
}

module.exports = {
  fetchPostsByTags,
  fetchFollowingsAndPosts,
  fetchParentDecodedCursor,
  fetchFeedsOfPost,
};

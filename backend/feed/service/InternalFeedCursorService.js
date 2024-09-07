const { fetchDecodedCursor } = require("../../util/Utility");
const Cursor = require("../../database/cursor");
const FollowerService = require("../../follower/services/FollowerService");
const PostService = require("../../post/services/PostService");
const logger = require("../../logger/logger");

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

function decodePostTagsCursor(cursor) {
  const decodedCursor = fetchDecodedCursor(cursor);
  if (decodedCursor != null) {
    return {
      postTagsCursor: decodedCursor.postTagsCursor,
      postFollowingCursor: decodedCursor.postFollowingCursor,
    };
  }
  return null;
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
};

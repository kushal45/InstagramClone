const { NotFoundError } = require("../../errors");
const PostService = require("../../post/services/PostService");
const logger = require("../../logger/logger");
const Cursor = require("../../database/cursor");
const { ErrorWithContext, ErrorContext } = require("../../errors/ErrorContext");
const {
  fetchParentDecodedCursor,
  fetchFeedsOfPost,
} = require("./InternalFeedCursorService");
const NewRelicInstrumentation = require("../../util/NewRelicInstrumentation");

class FeedService {
  /**
   * Fetches the feed for a user based on their tags and other parameters.
   *
   * @param {Object} params - The parameters for fetching the feed.
   * @param {Array<string>} params.userTags - An array of tags associated with the user.
   * @param {string} params.userId - The unique identifier of the user.
   * @param {Object} params.redisClient - The Redis client instance for caching and retrieving data.
   * @param {string} [params.cursor=""] - The cursor for pagination, defaults to an empty string.
   * @returns {Promise<Object>} - A promise that resolves to the user's personalized feed data, filtered by their followed users and interested tags.
   */
  static async fetch({
    userTags,
    userId,
    redisClient,
    cursor = "",
    sortOrder = "asc",
  }) {
    const logLocation = "FeedService.fetch";
    try {
      logger.debug("userTags from fetch", userTags);
      const cacheKey = `feed:${userId}:${(userTags != null
        ? userTags
        : []
      ).join(",")}:${cursor}:${sortOrder}`;

      const cachedData = await redisClient.hGetAll(cacheKey);
      logger.debug("cached feedData", cachedData);
      if (Object.keys(cachedData).length > 0) {
        return JSON.parse(cachedData.data);
      }
      const decodedRes = fetchParentDecodedCursor(cursor);

      const resultData = await NewRelicInstrumentation.startSegment(
        "fetchFeedsOfPost",
        async () => fetchFeedsOfPost({
          userTags,
          decodedRes,
          sortOrder,
          userId,
          redisClient,
          cacheKey,
        })
      );
      logger.debug("resultData", resultData);
      return resultData;
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          userTags,
          cursor,
          sortOrder,
        }),
        __filename
      );
    }
  }

  static async share(postId, userId) {
    const logLocation = "FeedService.share";
    try {
      const post = await PostService.getPostById(postId);
      if (!post) {
        throw new NotFoundError("Post not found");
      }
      logger.debug("post data to share", post);
      const sharedPost = await PostService.createPost(post, userId);
      return sharedPost;
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, { postId, userId })
      );
    }
  }
}

module.exports = FeedService;

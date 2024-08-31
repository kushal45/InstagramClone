const { NotFoundError } = require("../../errors");
const FollowerService = require("../../follower/services/FollowerService");
const PostService = require("../../post/services/PostService");
const logger = require("../../logger/logger");
const Cursor = require("../../database/cursor");
const { ErrorWithContext, ErrorContext } = require("../../errors/ErrorContext");

class FeedService {
  static async fetch({ userTags, userId, redisClient, cursor = "" }) {
    const logLocation = "FeedService.fetch";
    try {
      const cacheKey = `feed:${userId}:${(userTags != null
        ? userTags
        : []
      ).join(",")}:${cursor}`;
      let followingCursor = null;
      let postFollowingCursor = null;
      let postTagsCursor = null;
      if (cursor) {
        const decodeCursor = Cursor.decode(cursor);
        followingCursor = decodeCursor.followingCursor;
        postFollowingCursor = decodeCursor.postFollowingCursor;
        postTagsCursor = decodeCursor.postTagsCursor;
      }
      //const cachedData = await redisClient.hGetAll(cacheKey);
      // logger.debug("cached feedData", cachedData);
      // if (Object.keys(cachedData).length > 0) {
      //   return JSON.parse(cachedData.data);
      // }
      const { posts: postWithTags, nextCursor: newPostTagsCursor } =
        await PostService.listPostsByAttr(
          { tags: userTags, cursor: postTagsCursor },
          redisClient
        );
      const { followings, nextCursor: newFollowingCursor } =
        await FollowerService.listFollowing(userId, redisClient, {
          cursor: followingCursor,
        });
      //console.log("followings",followings);
      const followingIds = followings.map((following) => following.followingId);
      //console.log("followingIds",followingIds);
      const { posts: postWithFollowings, nextCursor: newPostFollowingCursor } =
        await PostService.listPostsByUserIds(followingIds, {
          cursor: postFollowingCursor,
        });
      const result = [...postWithTags, ...postWithFollowings];
      await redisClient.hSet(cacheKey, "data", JSON.stringify(result));
      await redisClient.hSet(cacheKey, "timestamp", Date.now().toString());
      await redisClient.expire(cacheKey, 3600); // Set expiration time to 1 hour
      return {
        data: result,
        cursor: Cursor.encode({
          followingCursor: newFollowingCursor,
          postFollowingCursor: newPostFollowingCursor,
          postTagsCursor: newPostTagsCursor,
        }),
      };
    } catch (error) {
      throw new ErrorWithContext(error, new ErrorContext(logLocation, { userTags, userId, cursor })).wrap();
    }
  }

  static async share(postId, userId) {
    const logLocation = "FeedService.share";
    try {
      const post = await PostService.getPostById(postId);
      if (!post) {
        throw new NotFoundError("Post not found");
      }
      const sharedPost = await PostService.createPost(post, userId);
      return sharedPost;
    } catch (error) {
      throw new ErrorWithContext(error, new ErrorContext(logLocation, { postId, userId })).wrap();
    }
  }
}

module.exports = FeedService;

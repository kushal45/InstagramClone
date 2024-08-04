const { NotFoundError } = require("../../errors");
const FollowerService = require("../../follower/services/FollowerService");
const PostService = require("../../post/services/PostService");

class FeedService {
  static async fetch({ userTags, userId, redisClient }) {
    const cacheKey = `feed:${userId}:${(userTags != null ? userTags : []).join(
      ","
    )}`;
    const cachedData = await redisClient.hGetAll(cacheKey);
    //console.log("cached feedData", cachedData);
    if (Object.keys(cachedData).length > 0) {
      console.log("timestamp of cache", cachedData.timestamp);
      return JSON.parse(cachedData.data);
    }
    const postWithTags = await PostService.listPostsByAttr(
      { tags: userTags },
      redisClient
    );
    const followings = await FollowerService.listFollowing(userId);
    //console.log("followings",followings);
    const followingIds = followings.map((following) => following.followingId);
    //console.log("followingIds",followingIds);
    const postWithFollowings = await PostService.listPostsByUserIds(
      followingIds
    );
    const result = [...postWithTags, ...postWithFollowings];
    await redisClient.hSet(cacheKey, "data", JSON.stringify(result));
    await redisClient.hSet(cacheKey, "timestamp", Date.now().toString());
    await redisClient.expire(cacheKey, 3600); // Set expiration time to 1 hour
    return result;
  }

  static async share(postId, userId) {
    const post = await PostService.getPostById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    const sharedPost = await PostService.createPost(post, userId);
    return sharedPost;
  }
}

module.exports = FeedService;

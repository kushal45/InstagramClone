const { NotFoundError } = require("../../errors");
const FollowerService = require("../../follower/services/FollowerService");
const PostService = require("../../post/services/PostService");

class FeedService {

  static async fetch({userTags,userId}){
    const postWithTags=await PostService.listPostsByAttr({tags:userTags});
    const followings=await FollowerService.listFollowing(userId);
    const followingIds=followings.map(following=>following.followingId);
    const postWithFollowings=await PostService.listPostsByUserIds(followingIds);
    return[...postWithTags,...postWithFollowings];
  }

  static async share(postId,userId){
    const post=await PostService.getById(postId);
    if(!post){
      throw new NotFoundError("Post not found");
    }
    const sharedPost=await PostService.create({
      userId,
      assetId:post.assetId,
    });
    return sharedPost;
  }
   

}

module.exports = FeedService;
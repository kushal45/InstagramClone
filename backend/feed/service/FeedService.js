const { NotFoundError } = require("../../errors");
const FollowerService = require("../../follower/services/FollowerService");
const PostService = require("../../post/services/PostService");

class FeedService {

  static async fetch({userTags,userId}){
    const postWithTags=await PostService.listPostsByAttr({tags:userTags});
    const followings=await FollowerService.listFollowing(userId);
    //console.log("followings",followings);
    const followingIds=followings.map(following=>following.followingId);
    //console.log("followingIds",followingIds);
    const postWithFollowings=await PostService.listPostsByUserIds(followingIds);
    return[...postWithTags,...postWithFollowings];
  }

  static async share(postId,userId){
    const post=await PostService.getPostById(postId);
    if(!post){
      throw new NotFoundError("Post not found");
    }
    const sharedPost=await PostService.createPost(post,userId);
    return sharedPost;
  }
   

}

module.exports = FeedService;
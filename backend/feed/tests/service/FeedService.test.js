const FeedService = require('../../service/FeedService');
const FollowerService = require('../../../follower/services/FollowerService');
const PostService = require('../../../post/services/PostService');
const { NotFoundError } = require('../../../errors');

jest.mock('../../../follower/services/FollowerService');
jest.mock('../../../post/services/PostService');

describe('FeedService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    it('should fetch posts by tags and followings', async () => {
      const userTags = ['tag1', 'tag2'];
      const userId = 'user1';
      const postsWithTags = [{ id: 'post1' }, { id: 'post2' }];
      const followings = [{ followingId: 'user2' }, { followingId: 'user3' }];
      const postsWithFollowings = [{ id: 'post3' }, { id: 'post4' }];

      PostService.listPostsByAttr.mockResolvedValue(postsWithTags);
      FollowerService.listFollowing.mockResolvedValue(followings);
      PostService.listPostsByUserIds.mockResolvedValue(postsWithFollowings);

      const result = await FeedService.fetch({ userTags, userId });

      expect(PostService.listPostsByAttr).toHaveBeenCalledWith({ tags: userTags });
      expect(FollowerService.listFollowing).toHaveBeenCalledWith(userId);
      expect(PostService.listPostsByUserIds).toHaveBeenCalledWith(['user2', 'user3']);
      expect(result).toEqual([...postsWithTags, ...postsWithFollowings]);
    });
  });

  describe('share', () => {
    it('should share a post successfully', async () => {
      const postId = 'post1';
      const userId = 'user1';
      const post = { id: 'post1', content: 'Post content' };
      const sharedPost = { id: 'post2', content: 'Post content', sharedBy: userId };

      PostService.getPostById.mockResolvedValue(post);
      PostService.createPost.mockResolvedValue(sharedPost);

      const result = await FeedService.share(postId, userId);

      expect(PostService.getPostById).toHaveBeenCalledWith(postId);
      expect(PostService.createPost).toHaveBeenCalledWith(post, userId);
      expect(result).toEqual(sharedPost);
    });

    it('should throw NotFoundError if the post does not exist', async () => {
      const postId = 'post1';
      const userId = 'user1';

      PostService.getPostById.mockResolvedValue(null);

      await expect(FeedService.share(postId, userId)).rejects.toThrow(NotFoundError);
      expect(PostService.getPostById).toHaveBeenCalledWith(postId);
      expect(PostService.createPost).not.toHaveBeenCalled();
    });
  });
});
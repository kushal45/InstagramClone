const PostService = require('../../services/PostService');
const UserDAO = require('../../../user/dao/UserDao');
const AssetDAO = require('../../../asset/dao/AssetDao');
const PostDAO = require('../../dao/PostDao');
const KafkaProducer = require('../../../kafka/Producer');
const httpContext = require('express-http-context');
const { NotFoundError } = require('../../../errors');

jest.mock('../../../user/dao/UserDao');
jest.mock('../../../asset/dao/AssetDAO');
jest.mock('../../dao/PostDAO');
jest.mock('../../../kafka/Producer');
jest.mock('express-http-context');

describe('PostService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const postData = { title: 'Test Post', assetId: null };
      const userId = '1';
      const user = { id: userId };
      const asset = { id: 'asset-1' };
      const post = { id: 'post-1', userId, assetId: asset.id };

      UserDAO.findUserById.mockResolvedValue(user);
      AssetDAO.create.mockResolvedValue(asset);
      PostDAO.create.mockResolvedValue(post);
      KafkaProducer.mockImplementation(() => ({
        produce: jest.fn(),
      }));
      httpContext.get.mockReturnValue('correlation-id');

      const result = await PostService.createPost(postData, userId);

      expect(UserDAO.findUserById).toHaveBeenCalledWith(userId);
      expect(AssetDAO.create).toHaveBeenCalledWith(postData);
      expect(PostDAO.create).toHaveBeenCalledWith({ userId: user.id, assetId: asset.id });
      expect(result).toEqual(post);
    });

    it('should throw NotFoundError if user is not found', async () => {
      const postData = { title: 'Test Post', assetId: null };
      const userId = '1';

      UserDAO.findUserById.mockResolvedValue(null);

      await expect(PostService.createPost(postData, userId)).rejects.toThrow(NotFoundError);
      expect(UserDAO.findUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('getPostById', () => {
    it('should return a post successfully', async () => {
      const postId = 'post-1';
      const post = { id: postId, title: 'Test Post' };

      PostDAO.getById.mockResolvedValue(post);

      const result = await PostService.getPostById(postId);

      expect(PostDAO.getById).toHaveBeenCalledWith(postId);
      expect(result).toEqual(post);
    });

    it('should throw NotFoundError if post is not found', async () => {
      const postId = 'post-1';

      PostDAO.getById.mockResolvedValue(null);

      await expect(PostService.getPostById(postId)).rejects.toThrow(NotFoundError);
      expect(PostDAO.getById).toHaveBeenCalledWith(postId);
    });
  });

  describe('listPostsByAttr', () => {
    it('should list posts by tags', async () => {
      const attr = { tags: ['tag1', 'tag2'] };
      const assetIds = ['asset1', 'asset2'];
      const posts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
  
      AssetDAO.findAssetIdsByTag.mockResolvedValue(assetIds);
      PostDAO.listByAssets.mockResolvedValue(posts);
  
      const result = await PostService.listPostsByAttr(attr);
  
      expect(AssetDAO.findAssetIdsByTag).toHaveBeenCalledWith(attr.tags);
      expect(PostDAO.listByAssets).toHaveBeenCalledWith(assetIds);
      expect(result).toEqual(posts);
    });
  
    it('should list posts by other attributes', async () => {
      const attr = { author: 'author1' };
      const posts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
  
      PostDAO.listByAttr.mockResolvedValue(posts);
  
      const result = await PostService.listPostsByAttr(attr);
  
      expect(PostDAO.listByAttr).toHaveBeenCalledWith(attr);
      expect(result).toEqual(posts);
    });
  
    it('should return an empty array if no posts are found', async () => {
      const attr = { author: 'author1' };
  
      PostDAO.listByAttr.mockResolvedValue([]);
  
      const result = await PostService.listPostsByAttr(attr);
  
      expect(PostDAO.listByAttr).toHaveBeenCalledWith(attr);
      expect(result).toEqual([]);
    });
  });

  describe('deletePost', () => {
    it('should delete a post and its associated asset successfully', async () => {
      const postId = 'post1';
      const post = { id: postId, assetId: 'asset1' };
      const assetId = post.assetId;
  
      PostDAO.getById.mockResolvedValue(post);
      AssetDAO.delete.mockResolvedValue(true);
      PostDAO.delete.mockResolvedValue(true);
  
      await PostService.deletePost(postId);
  
      expect(PostDAO.getById).toHaveBeenCalledWith(postId);
      expect(AssetDAO.delete).toHaveBeenCalledWith(assetId);
      expect(PostDAO.delete).toHaveBeenCalledWith(postId);
    });
  
    it('should throw NotFoundError if the post does not exist', async () => {
      const postId = 'post1';
  
      PostDAO.getById.mockResolvedValue(null);
  
      await expect(PostService.deletePost(postId)).rejects.toThrow(NotFoundError);
      expect(PostDAO.getById).toHaveBeenCalledWith(postId);
      expect(AssetDAO.delete).not.toHaveBeenCalled();
      expect(PostDAO.delete).not.toHaveBeenCalled();
    });
  
    it('should throw NotFoundError if the associated asset does not exist', async () => {
      const postId = 'post1';
      const post = { id: postId, assetId: 'asset1' };
      const assetId = post.assetId;
  
      PostDAO.getById.mockResolvedValue(post);
      AssetDAO.delete.mockResolvedValue(false);
  
      await expect(PostService.deletePost(postId)).rejects.toThrow(NotFoundError);
      expect(PostDAO.getById).toHaveBeenCalledWith(postId);
      expect(AssetDAO.delete).toHaveBeenCalledWith(assetId);
      expect(PostDAO.delete).not.toHaveBeenCalled();
    });
  
    it('should throw NotFoundError if the post deletion fails', async () => {
      const postId = 'post1';
      const post = { id: postId, assetId: 'asset1' };
      const assetId = post.assetId;
  
      PostDAO.getById.mockResolvedValue(post);
      AssetDAO.delete.mockResolvedValue(true);
      PostDAO.delete.mockResolvedValue(false);
  
      await expect(PostService.deletePost(postId)).rejects.toThrow(NotFoundError);
      expect(PostDAO.getById).toHaveBeenCalledWith(postId);
      expect(AssetDAO.delete).toHaveBeenCalledWith(assetId);
      expect(PostDAO.delete).toHaveBeenCalledWith(postId);
    });
  });

  describe('listPosts', () => {
    it('should list posts for a user with pagination', async () => {
      const userId = 'user1';
      const user = { id: userId };
      const posts = [{ id: 'post1' }, { id: 'post2' }];
      const page = 1;
      const pageSize = 10;
      const skip = (page - 1) * pageSize;

      UserDAO.findUserById.mockResolvedValue(user);
      PostDAO.listByUsers.mockResolvedValue(posts);

      const result = await PostService.listPosts(userId, { page, pageSize });

      expect(UserDAO.findUserById).toHaveBeenCalledWith(userId);
      expect(PostDAO.listByUsers).toHaveBeenCalledWith(user.id, { offset: skip, limit: pageSize });
      expect(result).toEqual(posts);
    });

    it('should throw NotFoundError if the user does not exist', async () => {
      const userId = 'user1';

      UserDAO.findUserById.mockResolvedValue(null);

      await expect(PostService.listPosts(userId)).rejects.toThrow(NotFoundError);
      expect(UserDAO.findUserById).toHaveBeenCalledWith(userId);
      expect(PostDAO.listByUsers).not.toHaveBeenCalled();
    });
  });

  describe('listPostsByUserIds', () => {
    it('should list posts for multiple users', async () => {
      const userIds = ['user1', 'user2'];
      const userList = [{ id: 'user1' }, { id: 'user2' }];
      const posts = [{ id: 'post1' }, { id: 'post2' }];

      UserDAO.findUserList.mockResolvedValue(userList);
      PostDAO.listByUsers.mockResolvedValue(posts);

      const result = await PostService.listPostsByUserIds(userIds);

      expect(UserDAO.findUserList).toHaveBeenCalledWith(userIds);
      expect(PostDAO.listByUsers).toHaveBeenCalledWith(userList.map(user => user.id));
      expect(result).toEqual(posts);
    });

    it('should throw NotFoundError if the users do not exist', async () => {
      const userIds = ['user1', 'user2'];

      UserDAO.findUserList.mockResolvedValue(null);

      await expect(PostService.listPostsByUserIds(userIds)).rejects.toThrow(NotFoundError);
      expect(UserDAO.findUserList).toHaveBeenCalledWith(userIds);
      expect(PostDAO.listByUsers).not.toHaveBeenCalled();
    });
  }); 
});
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
});
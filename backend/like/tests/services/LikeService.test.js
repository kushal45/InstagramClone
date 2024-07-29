const LikeService = require('../../services/LikeService');
const  PostDAO = require('../../../post/dao/PostDao');
const LikeDAO = require('../../dao/LikeDao');
const { NotFoundError } = require('../../../errors');

jest.mock('../../../post/dao/PostDao');
jest.mock('../../dao/LikeDao');

describe('LikeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLikesByPostId', () => {
    it('should return likes for a given post ID', async () => {
      const likes = [{ id: 1, postId: 'post1' }];
      LikeDAO.getLikesByPostId.mockResolvedValue(likes);

      const result = await LikeService.getLikesByPostId('post1');

      expect(LikeDAO.getLikesByPostId).toHaveBeenCalledWith('post1');
      expect(result).toEqual(likes);
    });
  });

  describe('likePost', () => {
    it('should like a post if it exists', async () => {
      const post = { id: 'post1' };
      const like = { id: 1, postId: 'post1' };
      PostDAO.getById.mockResolvedValue(post);
      LikeDAO.likePost.mockResolvedValue(like);

      const result = await LikeService.likePost('post1');

      expect(PostDAO.getById).toHaveBeenCalledWith('post1');
      expect(LikeDAO.likePost).toHaveBeenCalledWith('post1');
      expect(result).toEqual(like);
    });

    it('should throw NotFoundError if the post does not exist', async () => {
      PostDAO.getById.mockResolvedValue(null);

      await expect(LikeService.likePost('post1')).rejects.toThrow(NotFoundError);
      expect(PostDAO.getById).toHaveBeenCalledWith('post1');
      expect(LikeDAO.likePost).not.toHaveBeenCalled();
    });
  });

  describe('unlikePost', () => {
    it('should unlike a post if it exists', async () => {
      const post = { id: 'post1' };
      const like = { id: 1, postId: 'post1' };
      PostDAO.getById.mockResolvedValue(post);
      LikeDAO.unlikePost.mockResolvedValue(like);

      const result = await LikeService.unlikePost('post1');

      expect(PostDAO.getById).toHaveBeenCalledWith('post1');
      expect(LikeDAO.unlikePost).toHaveBeenCalledWith('post1');
      expect(result).toEqual(like);
    });

    it('should throw NotFoundError if the post does not exist', async () => {
      PostDAO.getById.mockResolvedValue(null);

      await expect(LikeService.unlikePost('post1')).rejects.toThrow(NotFoundError);
      expect(PostDAO.getById).toHaveBeenCalledWith('post1');
      expect(LikeDAO.unlikePost).not.toHaveBeenCalled();
    });
  });

  describe('deleteLike', () => {
    it('should delete a like and return a success message', async () => {
      LikeDAO.delete.mockResolvedValue();

      const result = await LikeService.deleteLike('like1');

      expect(LikeDAO.delete).toHaveBeenCalledWith('like1');
      expect(result).toEqual({ message: 'Like deleted successfully' });
    });

    it('should throw an error if deletion fails', async () => {
      const error = new Error('Test error');
      LikeDAO.delete.mockRejectedValue(error);

      await expect(LikeService.deleteLike('like1')).rejects.toThrow(error);
      expect(LikeDAO.delete).toHaveBeenCalledWith('like1');
    });
  });
});
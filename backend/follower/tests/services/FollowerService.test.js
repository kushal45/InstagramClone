const FollowerService = require('../../services/FollowerService');
const FollowerDao = require('../../dao/FollowerDao');

jest.mock('../../dao/FollowerDao');

describe('FollowerService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listFollowers', () => {
    it('should list followers of a user', async () => {
      const followers = [{ id: 'follower1' }, { id: 'follower2' }];
      FollowerDao.listFollowers.mockResolvedValue(followers);

      const result = await FollowerService.listFollowers('user1');

      expect(FollowerDao.listFollowers).toHaveBeenCalledWith('user1');
      expect(result).toEqual(followers);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      FollowerDao.listFollowers.mockRejectedValue(error);

      await expect(FollowerService.listFollowers('user1')).rejects.toThrow('Test error');
    });
  });

  describe('listFollowing', () => {
    it('should list users that a specific user is following', async () => {
      const following = [{ id: 'following1' }, { id: 'following2' }];
      FollowerDao.listFollowing.mockResolvedValue(following);

      const result = await FollowerService.listFollowing('user1');

      expect(FollowerDao.listFollowing).toHaveBeenCalledWith('user1');
      expect(result).toEqual(following);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      FollowerDao.listFollowing.mockRejectedValue(error);

      await expect(FollowerService.listFollowing('user1')).rejects.toThrow('Test error');
    });
  });

  describe('followUser', () => {
    it('should follow another user', async () => {
      const createdFollower = { id: 'follower1', followingId: 'user1' };
      FollowerDao.addFollower.mockResolvedValue(createdFollower);

      const result = await FollowerService.followUser('user2', 'user1');

      expect(FollowerDao.addFollower).toHaveBeenCalledWith('user2', 'user1');
      expect(result).toEqual(createdFollower);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      FollowerDao.addFollower.mockRejectedValue(error);

      await expect(FollowerService.followUser('user2', 'user1')).rejects.toThrow('Test error');
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow a user', async () => {
      FollowerDao.removeFollower.mockResolvedValue();

      const result = await FollowerService.unfollowUser('user2', 'user1');

      expect(FollowerDao.removeFollower).toHaveBeenCalledWith('user2', 'user1');
      expect(result).toEqual({ message: 'Unfollowed successfully' });
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      FollowerDao.removeFollower.mockRejectedValue(error);

      await expect(FollowerService.unfollowUser('user2', 'user1')).rejects.toThrow('Test error');
    });
  });
});
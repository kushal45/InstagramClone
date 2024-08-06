const FollowerController = require('../../controllers/FollowerController');
const FollowerService = require('../../services/FollowerService');

jest.mock('../../services/FollowerService');

describe('FollowerController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { userId: 'user1' }, userId: 'user2' };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listFollowers', () => {
    it('should list followers of a user', async () => {
      const followers = [{ id: 'follower1' }, { id: 'follower2' }];
      FollowerService.listFollowers.mockResolvedValue(followers);

      await FollowerController.listFollowers(req, res, next);

      expect(FollowerService.listFollowers).toHaveBeenCalledWith('user1');
      expect(res.json).toHaveBeenCalledWith(followers);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      FollowerService.listFollowers.mockRejectedValue(error);

      await FollowerController.listFollowers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listFollowing', () => {
    it('should list users that a specific user is following', async () => {
      const following = [{ id: 'following1' }, { id: 'following2' }];
      FollowerService.listFollowing.mockResolvedValue(following);

      await FollowerController.listFollowing(req, res, next);

      expect(FollowerService.listFollowing).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(following);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      FollowerService.listFollowing.mockRejectedValue(error);

      await FollowerController.listFollowing(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('followUser', () => {
    it('should follow another user', async () => {
      await FollowerController.followUser(req, res, next);

      expect(FollowerService.followUser).toHaveBeenCalledWith('user2', 'user1');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('Followed successfully.');
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      FollowerService.followUser.mockRejectedValue(error);

      await FollowerController.followUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow a user', async () => {
      await FollowerController.unfollowUser(req, res, next);

      expect(FollowerService.unfollowUser).toHaveBeenCalledWith('user2', 'user1');
      expect(res.send).toHaveBeenCalledWith('Unfollowed successfully.');
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      FollowerService.unfollowUser.mockRejectedValue(error);

      await FollowerController.unfollowUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
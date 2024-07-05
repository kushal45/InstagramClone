// PostController.test.js
const { createPost } = require('../controllers/PostController');
const User = require('../models/User');
const Asset = require('../models/Asset');
const Post = require('../models/Post');

// Mock the dependencies
jest.mock('../models/User');
jest.mock('../models/Asset');
jest.mock('../models/Post');

describe('PostController.createPost', () => {
  it('should create a post successfully', async () => {
    // Setup
    const req = {
      body: {
        username: 'testUser',
        text: 'Test post',
        imageUrl: 'http://example.com/image.jpg',
        videoUrl: 'http://example.com/video.mp4',
        tag: 'test'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    User.findOne.mockResolvedValue({ id: 1, username: 'testUser' });
    Asset.create.mockResolvedValue({ id: 1, imageUrl: req.body.imageUrl, videoUrl: req.body.videoUrl, text: req.body.text, tag: req.body.tag });
    Post.create.mockResolvedValue({ userId: 1, assetId: 1 });

    // Act
    await createPost(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
      message: "Post created successfully",
      post: expect.anything()
    }));
  });

  it('should return 404 if user not found', async () => {
    // Setup
    const req = { body: { username: 'nonexistentUser' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    User.findOne.mockResolvedValue(null);

    // Act
    await createPost(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: "User not found" });
  });

  // Add more tests as needed
});
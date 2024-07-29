const CommentController = require('../../controllers/CommentController');
const CommentService = require('../../services/CommentService');

jest.mock('../../services/CommentService');

describe('CommentController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { text: 'Sample comment' },
      params: { id: 'comment123' },
      userId: 'user123',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a comment and return 201 status', async () => {
      const createdComment = { id: 'comment123', text: 'Sample comment', userId: 'user123' };
      CommentService.createComment.mockResolvedValue(createdComment);

      await CommentController.create(req, res);

      expect(CommentService.createComment).toHaveBeenCalledWith({ text: 'Sample comment', userId: 'user123' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ message: 'Comment created', comment: createdComment });
    });

    it('should throw an error if creation fails', async () => {
      const error = new Error('Creation failed');
      CommentService.createComment.mockRejectedValue(error);

      await expect(CommentController.create(req, res)).rejects.toThrow(error);
    });
  });

  describe('getById', () => {
    it('should get a comment by id and return 200 status', async () => {
      const comment = { id: 'comment123', text: 'Sample comment', userId: 'user123' };
      CommentService.getCommentById.mockResolvedValue(comment);

      await CommentController.getById(req, res);

      expect(CommentService.getCommentById).toHaveBeenCalledWith('comment123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(comment);
    });

    it('should throw an error if fetching fails', async () => {
      const error = new Error('Fetching failed');
      CommentService.getCommentById.mockRejectedValue(error);

      await expect(CommentController.getById(req, res)).rejects.toThrow(error);
    });
  });
});
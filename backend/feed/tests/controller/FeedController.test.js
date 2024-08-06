const { validationResult } = require("express-validator");
const FeedService = require("../../service/FeedService");
const FeedController = require("../../controller/FeedController");
const { BadRequestError } = require("../../../errors");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

jest.mock("../../service/FeedService", () => ({
  fetch: jest.fn(),
  share: jest.fn(),
}));

describe("FeedController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      userTags: ["tag1", "tag2"],
      userId: "user123",
      body: { postId: "post123" },
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getFeeds", () => {
    it("should return feeds for a user", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      const feeds = [{ id: "feed1" }, { id: "feed2" }];
      FeedService.fetch.mockResolvedValue(feeds);

      await FeedController.getFeeds(req, res, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(FeedService.fetch).toHaveBeenCalledWith({ userTags: req.userTags, userId: req.userId });
      expect(res.json).toHaveBeenCalledWith(feeds);
    });

    it("should handle validation errors", async () => {
      const errors = { array: () => [{ msg: "Invalid tag" }] };
      validationResult.mockReturnValue({ isEmpty: () => false, array: errors.array });

      await FeedController.getFeeds(req, res, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(next).toHaveBeenCalledWith(new BadRequestError(JSON.stringify(errors.array())));
    });

    it("should handle service errors", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      const error = new Error("Service error");
      FeedService.fetch.mockRejectedValue(error);

      await FeedController.getFeeds(req, res, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(FeedService.fetch).toHaveBeenCalledWith({ userTags: req.userTags, userId: req.userId });
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("sharePost", () => {
    it("should share a post", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      const sharedPost = { id: "sharedPost1" };
      FeedService.share.mockResolvedValue(sharedPost);

      await FeedController.sharePost(req, res, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(FeedService.share).toHaveBeenCalledWith(req.body.postId, req.userId);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(sharedPost);
    });

    it("should handle validation errors", async () => {
      const errors = { array: () => [{ msg: "Invalid postId" }] };
      validationResult.mockReturnValue({ isEmpty: () => false, array: errors.array });

      await FeedController.sharePost(req, res, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(next).toHaveBeenCalledWith(new BadRequestError(JSON.stringify(errors.array())));
    });

    it("should handle service errors", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      const error = new Error("Service error");
      FeedService.share.mockRejectedValue(error);

      await FeedController.sharePost(req, res, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(FeedService.share).toHaveBeenCalledWith(req.body.postId, req.userId);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
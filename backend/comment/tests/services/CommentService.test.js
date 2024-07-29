const CommentService = require("../../services/CommentService");
const { UserDAO, PostDAO, AssetDAO, CommentDAO } = require("../../../dao");
const NotFoundError = require("../../../errors/NotFoundError");

jest.mock("../../../dao", () => ({
  UserDAO: {
    findUserById: jest.fn(),
  },
  PostDAO: {
    getById: jest.fn(),
  },
  AssetDAO: {
    create: jest.fn(),
  },
  CommentDAO: {
    create: jest.fn(),
    getById: jest.fn(),
  },
}));

describe("CommentService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createComment", () => {
    it("should create a comment successfully", async () => {
      const user = { id: "user123" };
      const post = { id: "post123" };
      const asset = { id: "asset123" };
      const comment = {
        id: "comment123",
        userId: "user123",
        postId: "post123",
        assetId: "asset123",

      };
      const commentReq={
        userId: "user123",
        postId: "post123",
        text:"text"
      }
      UserDAO.findUserById.mockResolvedValue(user);
      PostDAO.getById.mockResolvedValue(post);
      AssetDAO.create.mockResolvedValue(asset);
      CommentDAO.create.mockResolvedValue(comment);

      const result = await CommentService.createComment(commentReq);

      expect(UserDAO.findUserById).toHaveBeenCalledWith("user123");
      expect(PostDAO.getById).toHaveBeenCalledWith("post123");
      expect(AssetDAO.create).toHaveBeenCalledWith({
        imageUrl: undefined,
        videoUrl: undefined,
        text: "text",
        tags: ["other"],
      });
      expect(CommentDAO.create).toHaveBeenCalledWith({
        userId: "user123",
        postId: "post123",
        assetId: "asset123",
      });
      expect(result).toEqual(comment);
    });

    it("should throw NotFoundError if user is not found", async () => {
      UserDAO.findUserById.mockResolvedValue(null);

      await expect(
        CommentService.createComment(
          "user123",
          "post123",
          "imageUrl",
          "videoUrl",
          "text"
        )
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if post is not found", async () => {
      const comment = {
        id: "comment123",
        userId: "user123",
        postId: "post123",
        assetId: "asset123",
      };
      const user = { id: "user123" };
      UserDAO.findUserById.mockResolvedValue(user);
      PostDAO.getById.mockResolvedValue(null);

      await expect(CommentService.createComment(comment)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("getCommentById", () => {
    it("should get a comment by id successfully", async () => {
      const comment = {
        id: "comment123",
        text: "Sample comment",
        userId: "user123",
      };
      CommentDAO.getById.mockResolvedValue(comment);

      const result = await CommentService.getCommentById("comment123");

      expect(CommentDAO.getById).toHaveBeenCalledWith("comment123");
      expect(result).toEqual(comment);
    });

    it("should throw NotFoundError if comment is not found", async () => {
      CommentDAO.getById.mockResolvedValue(null);

      await expect(CommentService.getCommentById("comment123")).rejects.toThrow(
        NotFoundError
      );
    });
  });
});

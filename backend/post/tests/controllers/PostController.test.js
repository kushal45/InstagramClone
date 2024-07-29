const request = require("supertest");
const express = require("express");
const PostController = require("../../controllers/PostController");
const PostService = require("../../services/PostService.js");
const { validationResult } = require("express-validator");
jest.mock("../../services/PostService");

const app = express();
app.use(express.json());
app.post("/posts", PostController.createPost);
app.get("/posts", PostController.getAllPosts);
app.get("/posts/:id", PostController.getPostById);

describe("PostController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    it("should create a post successfully", async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn(() => true),
        array: jest.fn(() => [{ msg: "Invalid title" }]),
      });
      PostService.createPost.mockResolvedValue({ id: 1, title: "Test Post" });

      const response = await request(app)
        .post("/posts")
        .send({ title: "Test Post" })
        .set("userId", "1");

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Post created successfully");
      expect(response.body.post).toEqual({ id: 1, title: "Test Post" });
    });

    it("should return validation error", async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: "Invalid title" }]),
      });

      const response = await request(app)
        .post("/posts")
        .send({ title: "" })
        .set("userId", "1");

      expect(response.status).toBe(400);
    });

    it("should handle service errors", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      PostService.createPost.mockRejectedValue(new Error("Service Error"));

      const response = await request(app)
        .post("/posts")
        .send({ title: "Test Post" })
        .set("userId", "1");

      expect(response.status).toBe(500);
    });
  });

  describe("getAllPosts", () => {
    it("should return all posts", async () => {
      PostService.listPosts.mockResolvedValue([{ id: 1, title: "Test Post" }]);

      const response = await request(app).get("/posts").query({ userId: "1" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, title: "Test Post" }]);
    });

    it("should handle service errors", async () => {
      PostService.listPosts.mockRejectedValue(new Error("Service Error"));

      const response = await request(app).get("/posts").set("userId", "1");

      expect(response.status).toBe(500);
    });
  });

  describe("getPostById", () => {
    it("should return a single post", async () => {
      PostService.getPostById.mockResolvedValue({ id: 1, title: "Test Post" });

      const response = await request(app).get("/posts/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, title: "Test Post" });
    });
  });
});

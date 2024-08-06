const request = require("supertest");
const express = require("express");
const UserController = require("../../controllers/UserController");
const UserService = require("../../services/UserService");
const { validationResult } = require("express-validator");

jest.mock("../../services/UserService");
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.userId = req.headers["userid"];
  next();
});
app.get("/user/:username", UserController.show);
app.post("/user", UserController.store);
app.put("/user", UserController.update);
app.put("/user/password", UserController.updatePassword);

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validationResult.mockReturnValueOnce({
      isEmpty: jest.fn(() => true),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /user/:username", () => {
    it("should return user profile for a given username", async () => {
      const userProfile = { body: { username: "testuser", name: "Test User" } };
      UserService.getUserProfile.mockResolvedValue(userProfile);

      const response = await request(app)
        .get("/user/testuser")
        .set("userId", "123");

      expect(UserService.getUserProfile).toHaveBeenCalledWith(
        "testuser",
        "123"
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(userProfile.body);
    });

    it("should handle errors", async () => {
      UserService.getUserProfile.mockRejectedValue(new Error("Test error"));

      const response = await request(app)
        .get("/user/testuser")
        .set("userId", "123");

      expect(UserService.getUserProfile).toHaveBeenCalledWith(
        "testuser",
        "123"
      );
      expect(response.status).toBe(500);
    });
  });

  describe("POST /user", () => {
    it("should register a new user", async () => {
      const newUser = {
        username: "newuser",
        name: "New User",
        password: "password",
      };
      UserService.registerUser.mockResolvedValue({
        body: { username: "newuser", name: "New User", password: "password" },
      });

      const response = await request(app).post("/user").send(newUser);

      expect(UserService.registerUser).toHaveBeenCalledWith(
        expect.objectContaining(newUser)
      );
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUser);
    });

    it("should handle errors", async () => {
      UserService.registerUser.mockRejectedValue(new Error("Test error"));

      const response = await request(app)
        .post("/user")
        .send({ username: "newuser", password: "password", name: "name" });

      expect(UserService.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "newuser",
          password: "password",
          name: "name",
        })
      );
      expect(response.status).toBe(500);
    });
  });

  describe("PUT /user", () => {
    it("should update user profile", async () => {
      const updatedProfile = { username: "updateduser", name: "Updated User" };
      UserService.updateUserProfile.mockResolvedValue(updatedProfile);

      const response = await request(app)
        .put("/user")
        .set("userId", "123")
        .send({ username: "updateduser", name: "Updated User" });

      expect(UserService.updateUserProfile).toHaveBeenCalledWith("123", {
        username: "updateduser",
        name: "Updated User",
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProfile);
    });

    it("should handle errors", async () => {
      UserService.updateUserProfile.mockRejectedValue(new Error("Test error"));

      const response = await request(app)
        .put("/user")
        .set("userId", "123")
        .send({ username: "updateduser", name: "Updated User" });

      expect(UserService.updateUserProfile).toHaveBeenCalledWith("123", {
        username: "updateduser",
        name: "Updated User",
      });
      expect(response.status).toBe(500);
    });
  });

  describe("PUT /user/password", () => {
    it("should update user password", async () => {
      const updatePasswordResponse = {
        message: "Password updated successfully",
      };
      UserService.updatePassword.mockResolvedValue(updatePasswordResponse);

      const response = await request(app)
        .put("/user/password")
        .set("userId", "123")
        .send({
          password_old: "oldpassword",
          password: "newpassword",
          password_confirm: "newpassword",
        });

      expect(UserService.updatePassword).toHaveBeenCalledWith({
        userId: "123",
        passwordOld: "oldpassword",
        password: "newpassword",
        passwordConfirm: "newpassword",
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatePasswordResponse);
    });

    it("should handle errors", async () => {
      UserService.updatePassword.mockRejectedValue(new Error("Test error"));

      const response = await request(app)
        .put("/user/password")
        .set("userId", "123")
        .send({
          password_old: "oldpassword",
          password: "newpassword",
          password_confirm: "newpassword",
        });

      expect(UserService.updatePassword).toHaveBeenCalledWith({
        userId: "123",
        passwordOld: "oldpassword",
        password: "newpassword",
        passwordConfirm: "newpassword",
      });
      expect(response.status).toBe(500);
    });
  });
});

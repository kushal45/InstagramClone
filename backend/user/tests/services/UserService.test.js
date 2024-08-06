const UserService = require("../../services/UserService");
const UserDAO = require("../../dao/UserDao");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NotFoundError = require("../../../errors/NotFoundError");
const { BadRequestError } = require("../../../errors");
const Utility = require("../../utils/Utility");

jest.mock("../../dao/UserDao");
//jest.mock('../models/Follow');
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock('../../utils/Utility');

describe("UserService", () => {
  const username = "testuser";
  const currentUserId = 1;
  const user = { id: 1, username: "testuser", password: "hashedpassword" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserProfile", () => {
    it("should return user profile with follow counts and isProfile flag", async () => {
      UserDAO.findUserByQuery.mockResolvedValue(user);
      //Follow.count.mockResolvedValueOnce(10); // count_follows
      // Follow.count.mockResolvedValueOnce(5);  // count_followers

      const result = await UserService.getUserProfile(username, currentUserId);

      expect(UserDAO.findUserByQuery).toHaveBeenCalledWith(
        { username },
        { exclude: ["password", "updatedAt"] }
      );
      //  expect(Follow.count).toHaveBeenCalledTimes(2);
      // expect(Follow.count).toHaveBeenCalledWith({ where: { followerId: user.id } });
      // expect(Follow.count).toHaveBeenCalledWith({ where: { followingId: user.id } });
      expect(result).toEqual({
        body: {
          user,
          isProfile: true,
        },
      });
    });

    it("should throw NotFoundError if user is not found", async () => {
      UserDAO.findUserByQuery.mockResolvedValue(null);

      await expect(
        UserService.getUserProfile(username, currentUserId)
      ).rejects.toThrow(NotFoundError);
      expect(UserDAO.findUserByQuery).toHaveBeenCalledWith(
        { username },
        { exclude: ["password", "updatedAt"] }
      );
    });

    it("should set isProfile to false if user id does not match currentUserId", async () => {
      const anotherUser = { id: 2, username: "anotheruser" };
      UserDAO.findUserByQuery.mockResolvedValue(anotherUser);
      //Follow.count.mockResolvedValueOnce(10); // count_follows
      // Follow.count.mockResolvedValueOnce(5);  // count_followers

      const result = await UserService.getUserProfile(username, currentUserId);

      expect(result.body.isProfile).toBe(false);
    });
  });

  describe("login", () => {
    const password = "password";
    const token = "jsonwebtoken";

    it("should return a token if username and password match", async () => {
      UserDAO.findUserByQuery.mockResolvedValue(user);
      bcryptjs.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(token);

      const result = await UserService.login(username, password);

      expect(UserDAO.findUserByQuery).toHaveBeenCalledWith({ username });
      expect(bcryptjs.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, username: user.username, tags: user.tags },
        process.env.SIGNATURE_TOKEN,
        { expiresIn: 86400 }
      );
      expect(result).toEqual({ body: { token } });
    });

    it("should throw NotFoundError if user is not found", async () => {
      UserDAO.findUserByQuery.mockResolvedValue(null);

      await expect(UserService.login(username, password)).rejects.toThrow(
        NotFoundError
      );
      expect(UserDAO.findUserByQuery).toHaveBeenCalledWith({ username });
    });

    it("should throw NotFoundError if password does not match", async () => {
      UserDAO.findUserByQuery.mockResolvedValue(user);
      bcryptjs.compare.mockResolvedValue(false);

      await expect(UserService.login(username, password)).rejects.toThrow(
        NotFoundError
      );
      expect(UserDAO.findUserByQuery).toHaveBeenCalledWith({ username });
      expect(bcryptjs.compare).toHaveBeenCalledWith(password, user.password);
    });
  });

  describe("registerUser", () => {
    it("should throw BadRequestError if email already exists", async () => {
      UserDAO.findUserByEmailOrUsername.mockResolvedValue({
        email: "test@example.com",
      });

      await expect(
        UserService.registerUser({
          name: "Test",
          email: "test@example.com",
          username: "testuser",
          password: "password",
        })
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if username already exists", async () => {
      UserDAO.findUserByEmailOrUsername.mockResolvedValue({
        username: "testuser",
      });

      await expect(
        UserService.registerUser({
          name: "Test",
          email: "test@example.com",
          username: "testuser",
          password: "password",
        })
      ).rejects.toThrow(BadRequestError);
    });

    it("should register user successfully", async () => {
      UserDAO.findUserByEmailOrUsername.mockResolvedValue(null);
      bcryptjs.genSalt.mockResolvedValue("salt");
      bcryptjs.hash.mockResolvedValue("hashedPassword");
      UserDAO.createUser.mockResolvedValue({
        id: 1,
        username: "testuser",
        tags: [],
      });
      jwt.sign.mockReturnValue("token");

      const result = await UserService.registerUser({
        name: "Test",
        email: "test@example.com",
        username: "testuser",
        password: "password",
      });

      expect(result).toEqual({ body: { token: "token" } });
    });
  });

  describe("getUserById", () => {
    it("should throw NotFoundError if user is not found", async () => {
      UserDAO.findUserById.mockResolvedValue(null);

      await expect(
        UserService.getUserById(1, ["name", "email"])
      ).rejects.toThrow(NotFoundError);
    });

    it("should return user if found", async () => {
      const user = { id: 1, name: "Test" };
      UserDAO.findUserById.mockResolvedValue(user);

      const result = await UserService.getUserById(1, ["name", "email"]);

      expect(result).toEqual(user);
    });
  });

  describe("getUserByUsername", () => {
    it("should throw NotFoundError if user is not found", async () => {
      UserDAO.findUserByQuery.mockResolvedValue(null);

      await expect(UserService.getUserByUsername("testuser")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should return user if found", async () => {
      const user = { id: 1, username: "testuser" };
      UserDAO.findUserByQuery.mockResolvedValue(user);

      const result = await UserService.getUserByUsername("testuser");

      expect(result).toEqual(user);
    });
  });

  describe('updatePassword', () => {
    it('should throw NotFoundError if user is not found', async () => {
      UserDAO.findUserById.mockResolvedValue(null);

      await expect(UserService.updatePassword({
        reqUser: { userId: 1 },
        password: 'newPassword',
        passwordOld: 'oldPassword',
        passwordConfirm: 'newPassword'
      })).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if old password does not match', async () => {
      const user = { id: 1, password: 'hashedOldPassword' };
      UserDAO.findUserById.mockResolvedValue(user);
      bcryptjs.compare.mockResolvedValue(false);

      await expect(UserService.updatePassword({
        reqUser: { userId: 1 },
        password: 'newPassword',
        passwordOld: 'oldPassword',
        passwordConfirm: 'newPassword'
      })).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if new passwords do not match', async () => {
      const user = { id: 1, password: 'hashedOldPassword' };
      UserDAO.findUserById.mockResolvedValue(user);
      bcryptjs.compare.mockResolvedValue(true);

      await expect(UserService.updatePassword({
        reqUser: { userId: 1 },
        password: 'newPassword',
        passwordOld: 'oldPassword',
        passwordConfirm: 'differentNewPassword'
      })).rejects.toThrow(BadRequestError);
    });

    it('should update password successfully', async () => {
      const user = { id: 1, password: 'hashedOldPassword' };
      UserDAO.findUserById.mockResolvedValue(user);
      bcryptjs.compare.mockResolvedValue(true);
      bcryptjs.genSalt.mockResolvedValue('salt');
      bcryptjs.hash.mockResolvedValue('hashedNewPassword');
      UserDAO.updateUser.mockResolvedValue({ id: 1, password: 'hashedNewPassword' });

      const result = await UserService.updatePassword({
        reqUser: { userId: 1 },
        password: 'newPassword',
        passwordOld: 'oldPassword',
        passwordConfirm: 'newPassword'
      });

      expect(result).toEqual({ id: 1, password: 'hashedNewPassword' });
    });
  });

  describe('updateUserProfile', () => {
    it('should throw NotFoundError if user is not found', async () => {
      UserDAO.findUserById.mockResolvedValue(null);

      await expect(UserService.updateUserProfile(1, {})).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if no fields are updated', async () => {
      const user = { id: 1, tags: [], langPrefs: [] };
      UserDAO.findUserById.mockResolvedValue(user);
      Utility.updateChangedFields.mockResolvedValue({});

      await expect(UserService.updateUserProfile(1, {})).rejects.toThrow(BadRequestError);
    });

    it('should update tags if they are different', async () => {
      const user = { id: 1, tags: ['tag1'], langPrefs: [] };
      const profileData = { tags: ['tag2'] };
      UserDAO.findUserById.mockResolvedValue(user);
      Utility.updateChangedFields.mockResolvedValue({});
      Utility.findDeltaBetwn2Sets.mockReturnValue(new Set(['tag2']));

      await UserService.updateUserProfile(1, profileData);

      expect(UserDAO.updateUser).toHaveBeenCalledWith(1, { tags: ['tag2'] });
    });

    it('should update langPrefs if they are different', async () => {
      const user = { id: 1, tags: [], langPrefs: ['en'] };
      const profileData = { langPrefs: ['fr'] };
      UserDAO.findUserById.mockResolvedValue(user);
      Utility.updateChangedFields.mockResolvedValue({});
      Utility.findDeltaBetwn2Sets.mockReturnValue(new Set(['fr']));

      await UserService.updateUserProfile(1, profileData);

      expect(UserDAO.updateUser).toHaveBeenCalledWith(1, { langPrefs: ['fr'] });
    });

    it('should update both tags and langPrefs if they are different', async () => {
      const user = { id: 1, tags: ['tag1'], langPrefs: ['en'] };
      const profileData = { tags: ['tag2'], langPrefs: ['fr'] };
      UserDAO.findUserById.mockResolvedValue(user);
      Utility.updateChangedFields.mockResolvedValue({});
      Utility.findDeltaBetwn2Sets
        .mockReturnValueOnce(new Set(['tag2']))
        .mockReturnValueOnce(new Set(['fr']));

      await UserService.updateUserProfile(1, profileData);

      expect(UserDAO.updateUser).toHaveBeenCalledWith(1, { tags: ['tag2'], langPrefs: ['fr'] });
    });
  });

  describe('updateUser', () => {
    it('should throw NotFoundError if user is not found', async () => {
      UserDAO.findUserById.mockResolvedValue(null);

      await expect(UserService.updateUser(1, {})).rejects.toThrow(NotFoundError);
    });

    it('should hash the password if it is updated', async () => {
      const user = { id: 1, update: jest.fn() };
      const hashedPassword = 'hashedPassword';
      UserDAO.findUserById.mockResolvedValue(user);
      bcryptjs.hash.mockResolvedValue(hashedPassword);

      const updateData = { password: 'newPassword' };
      await UserService.updateUser(1, updateData);

      expect(bcryptjs.hash).toHaveBeenCalledWith('newPassword', 8);
      expect(user.update).toHaveBeenCalledWith({ password: hashedPassword });
    });

    it('should update other fields if they are provided', async () => {
      const user = { id: 1, update: jest.fn() };
      UserDAO.findUserById.mockResolvedValue(user);

      const updateData = { email: 'newemail@example.com' };
      await UserService.updateUser(1, updateData);

      expect(user.update).toHaveBeenCalledWith(updateData);
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundError if user is not found', async () => {
      UserDAO.findUserById.mockResolvedValue(null);

      await expect(UserService.deleteUser(1)).rejects.toThrow(NotFoundError);
    });

    it('should delete the user if found', async () => {
      const user = { id: 1, destroy: jest.fn() };
      UserDAO.findUserById.mockResolvedValue(user);

      await UserService.deleteUser(1);

      expect(user.destroy).toHaveBeenCalled();
    });
  });
});

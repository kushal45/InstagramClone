const request = require('supertest');
const express = require('express');
const AuthController = require('../../controllers/AuthController');
const UserService = require('../../services/UserService');
const { validationResult } = require('express-validator');

jest.mock('../../services/UserService');

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

const app = express();
app.use(express.json());

// Middleware to set req.userId from headers
app.use((req, res, next) => {
  req.userId = req.headers['userid'];
  req.redis = {
    setex: jest.fn(), // Mock redis setex method
  };
  next();
});

app.get('/user/howIam', AuthController.howIam);
app.post('/user/login', AuthController.login);

describe('AuthController', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    validationResult.mockReturnValueOnce({
      isEmpty: jest.fn(() => true),
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /user/howIam', () => {
    it('should return user data', async () => {
      const user = { id: '123', username: 'testuser', name: 'Test User', avatar_url: 'http://example.com/avatar.png' };
      UserService.getUserById.mockResolvedValue(user);

      const response = await request(app)
        .get('/user/howIam')
        .set('userId', '123');

      expect(UserService.getUserById).toHaveBeenCalledWith('123', {
        attributes: ['id', 'username', 'name', 'avatar_url'],
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
    });

    it('should handle errors', async () => {
      UserService.getUserById.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .get('/user/howIam')
        .set('userId', '123');

      expect(UserService.getUserById).toHaveBeenCalledWith('123', {
        attributes: ['id', 'username', 'name', 'avatar_url'],
      });
      expect(response.status).toBe(500);
    });
  });

  describe('POST /user/login', () => {
    it('should login user', async () => {
      const loginResult = { body: { token: 'testtoken' } };
      UserService.login.mockResolvedValue(loginResult);
     const loginObj={ username: 'testuser', password: 'testpassword' }
      const response = await request(app)
        .post('/user/login')
        .send(loginObj);

      expect(UserService.login).toHaveBeenCalledWith('testuser', 'testpassword');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(loginResult.body);
    });

    it('should handle login errors', async () => {
      UserService.login.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .post('/user/login')
        .send({ username: 'testuser', password: 'testpassword' });

      expect(UserService.login).toHaveBeenCalledWith('testuser', 'testpassword');
      expect(response.status).toBe(500);
    });
  });
});
const express = require('express');
const FollowerController = require('./controllers/FollowerController');
const AuthMiddleware = require('../user/middleware/Auth');

const router = express.Router();

// List users that a specific user is following
router.get('/:userId/following',AuthMiddleware, FollowerController.listFollowing);

// Follow another user
router.post('/:userId/follow',AuthMiddleware, FollowerController.followUser);

// Unfollow a user
router.delete('/:userId/unfollow', AuthMiddleware,FollowerController.unfollowUser);

module.exports = router;
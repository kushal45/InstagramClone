/**
 * FeedController feattures the following:
 * 1. Get all feeds containing posts and commments based on filtered tags for that user profile
 * 2. get posts based on user following
 * 3. share posts from their feeds
 * 4. Filter and sort feed
 *
 */

const { validationResult } = require("express-validator");
const FeedService = require("../service/FeedService");
const { BadRequestError } = require("../../errors");

class FeedController {
  // Get all feeds for a user
  static async getFeeds(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError(JSON.stringify(errors.array()));
      }
      const userTags = req.user.tags;
      const userId = req.userId;
      const feeds = await FeedService.fetch({ userTags, userId });
      res.json(feeds);
    } catch (error) {
      next(error);
    }
  }

  // Share a post
  static async sharePost(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError(JSON.stringify(errors.array()));
      }
      const { postId } = req.body;
      const userId = req.userId;
      const sharedPost = await FeedService.share(postId, userId);
      res.status(201).send(sharedPost);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FeedController;

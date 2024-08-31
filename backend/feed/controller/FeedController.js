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
const logger = require("../../logger/logger");
const ResponseFormatter = require("../../util/ResponseFormatter");

class FeedController {
  // Get all feeds for a user
  static async getFeeds(req, res, next) {
    try {
      const cursor = req.query.cursor;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError(JSON.stringify(errors.array()));
      }
      const userTags = req.userTags;
      logger.debug("userTags", userTags);
      const userId = req.userId;
      const redisClient = req.redis;
      const feeds = await FeedService.fetch({ userTags, userId, redisClient, cursor });
      res.json(ResponseFormatter.success(feeds, "Feeds retrieved successfully"));
    } catch (error) {
      logger.error(error);
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
      res.status(201).send(ResponseFormatter.success(sharedPost, "Post shared successfully"));
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
}

module.exports = FeedController;

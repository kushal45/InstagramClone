//create routes for getFeeds and sharePost

const { Router } = require("express");
const FeedMiddleware = require("./middleware/Feed");
const FeedController = require("./controller/FeedController");
const ValidationFeed = require("./validations/Feed");

const routes = Router();

// ** Routes Feed ** //
routes.get("/", FeedMiddleware, FeedController.getFeeds);
routes.post("/share", FeedMiddleware, ValidationFeed.share, FeedController.sharePost);

module.exports = routes;
//create routes for getFeeds and sharePost

const { Router } = require("express");
const FeedController = require("./controller/FeedController");
const AuthMiddleware = require("../user/middleware/Auth");
const {validateGetFeeds,validateSharePost} = require("./validation/Feed");

const routes = Router();

// ** Routes Feed ** //
routes.get("/", AuthMiddleware, FeedController.getFeeds);
routes.post("/share", validateSharePost, FeedController.sharePost);

module.exports = routes;
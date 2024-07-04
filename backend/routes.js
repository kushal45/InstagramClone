const { Router } = require("express");
//const multer = require("multer");
//const multerConfig = require("./config/multer");

const routes = Router();

const AuthMiddleware = require("./middleware/Auth");

const RedisMiddleware = require("./middleware/Redis"); // Middleware of redis
const CacheHowiam = require("./middleware/RedisCache"); // Middleware of redis
require("./database");
const ValidationsUser = require("./Validation/User");
// const ValidationComment = require("./Validations/ValidationComment");
const ValidationAuth = require("./Validation/Auth");

const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");
// const PhotoController = require("./Controllers/PhotoController");
// const LikeController = require("./Controllers/LikeController");
// const CommentController = require("./Controllers/CommentController");
// const FollowController = require("./Controllers/FollowController");
// const FeedController = require("./Controllers/FeedController");
// const SearchController = require("./Controllers/SearchController");

// ** Routes Authenticate ** //
routes.post("/auth", ValidationAuth.login, AuthController.login);
routes.get(
    "/auth",
    AuthMiddleware,
    RedisMiddleware,
    CacheHowiam,
    AuthController.howIam
);

// ** Routes Authenticate ** //

// ** Routes user ** //
routes.get("/users/:username", AuthMiddleware, UserController.show);
routes.post("/users", ValidationsUser.withPassword, UserController.store);
routes.put(
    "/users",
    AuthMiddleware,
    ValidationsUser.withoutPassword,
    UserController.update
);
routes.put(
    "/password-update",
    AuthMiddleware,
    ValidationsUser.password,
    UserController.updatePassword
);

/**
 * Routes Post
 * Post table
 * post can be 
 * 1) text string 
 * 2) image  url 
 * 3) video  url 
 * postId   userId  post 
 */
// routes.post("/post/:user-id")

// /**
//  * Routes feed
//  */


// // ** Routes user ** //

// // ** Routes photo ** //
// routes.get("/photos/:id", authMiddleware, PhotoController.show);
// routes.post(
//     "/photos",
//     authMiddleware,
//     multer(multerConfig).single("file"),
//     PhotoController.store
// );
// routes.delete("/photos/:id", authMiddleware, PhotoController.destroy);

// // ** Routes photo ** //

// // ** Routes Like ** //

// routes.post("/likes/:photo", authMiddleware, LikeController.store);

// // ** Routes Like ** //

// // ** Routes Comment ** //

// routes.post(
//     "/comments/:photo",
//     ValidationComment.comment,
//     authMiddleware,
//     CommentController.store
// );
// routes.put(
//     "/comments/:id",
//     ValidationComment.comment,
//     authMiddleware,
//     CommentController.update
// );
// routes.delete("/comments/:id", authMiddleware, CommentController.destroy);

// // ** Routes Comment ** //

// // ** Routes Follow ** //

// routes.post("/follows/:user_id", authMiddleware, FollowController.store);

// // ** Routes Follow ** //

// // ** Routes Feed ** //

// routes.get("/feeds", authMiddleware, FeedController.show);
// routes.get("/follows", authMiddleware, FeedController.showFollow);

// ** Routes Feed ** //

// ** Routes Feed ** //

//routes.get("/search/:term", authMiddleware, SearchController.search);

// ** Routes Feed ** //

module.exports = routes;
const { Router } = require("express");
const AuthMiddleware= require('../user/middleware/Auth');
const ValidationLike= require('./validations/Like');
const LikeController= require('./controllers/LikeController');

const routes = Router();
// ** Routes Like ** //

routes.post(
    "/like",
    AuthMiddleware,
    LikeController.like
  );
  
  routes.put(
    "/unlike",
    AuthMiddleware,
    ValidationLike.validateLike,
    LikeController.unlike
  );
  routes.get("/show", AuthMiddleware, LikeController.show);
  routes.delete("/like", AuthMiddleware, LikeController.delete);

  module.exports = routes;
const LikeService = require("../services/LikeService");

module.exports = {
   async show(req, res,next) {
    try {
      const likes = await LikeService.getLikesByPostId(req.query.postId);
      return res.json(likes);
    } catch (err) {
      next(err)
    }
  },
  async like(req, res,next) {
    try {
      const like = await LikeService.likePost(req.body.postId);
      return res.json(like);
    } catch (err) {
      next(err);
    }
  },
  async unlike(req, res,next) {
    try {
      const like = await LikeService.unlikePost(req.body.postId);
      return res.json(like);
    } catch (err) {
      next(err);
    }
  },
  async delete(req, res,next) {
    try {
      const message = await LikeService.deleteLike(req.params.id);
      return res.status(200).json(message);
    } catch (err) {
      next(err)
    }
  },
};
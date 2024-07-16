const {LikeService} = require("../../services");

module.exports = {
  async show(req, res) {
    try {
      const likes = await LikeService.getLikesByPostId(req.query.postId);
      return res.json(likes);
    } catch (err) {
      throw err;
    }
  },
  async like(req, res) {
    try {
      const like = await LikeService.likePost(req.body.postId);
      return res.json(like);
    } catch (err) {
      throw err;
    }
  },
  async unlike(req, res) {
    try {
      const like = await LikeService.unlikePost(req.body.postId);
      return res.json(like);
    } catch (err) {
      throw err;
    }
  },
  async delete(req, res) {
    try {
      const message = await LikeService.deleteLike(req.params.id);
      return res.status(200).json(message);
    } catch (err) {
      throw err;
    }
  },
};
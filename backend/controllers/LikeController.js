const {LikeService} = require("../services");

module.exports = {
  async show(req, res) {
    try {
      const likes = await LikeService.getLikesByPostId(req.query.postId);
      return res.json(likes);
    } catch (err) {
      return res.status(500).json({ error: "Error while fetching likes" });
    }
  },
  async like(req, res) {
    try {
      const like = await LikeService.likePost(req.body.postId);
      return res.json(like);
    } catch (err) {
      const status = err.message === "Post not found" ? 400 : 500;
      return res.status(status).json({ error: err.message });
    }
  },
  async unlike(req, res) {
    try {
      const like = await LikeService.unlikePost(req.body.postId);
      return res.json(like);
    } catch (err) {
      const status = err.message === "Post not found" || err.message === "Like not found" || err.message === "Like count is already 0" ? 400 : 500;
      return res.status(status).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const message = await LikeService.deleteLike(req.params.id);
      return res.status(200).json(message);
    } catch (err) {
      const status = err.message === "Like not found" ? 400 : 500;
      return res.status(status).json({ error: err.message });
    }
  },
};
//generate LikeController Crud  by using Like model to performs/view likes using Post model
const { Like, Post } = require("../models");

module.exports = {
  //get likes by postId
  async show(req, res) {
    try {
      const { postId } = req.query;
      const likes = await Like.findOne({
        where: { postId },
      });
      return res.json(likes);
    } catch (err) {
      return res.status(500).json({ error: "Error while fetching likes" });
    }
  },
  //create/update like by postId
  async like(req, res) {
    try {
      console.log("req.body", req.body);
      const { postId } = req.body;
    
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(400).json({ error: "Post not found" });
      }
      const existingLike = await Like.findOne({
        where: { postId },
      });
      if (!existingLike) {
        const like = await Like.create({ postId, count: 1 });
        return res.json(like);
      }
      existingLike.count += 1;
      await existingLike.save();
      return res.json(existingLike);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Error while creating like" });
    }
  },
  async unlike(req, res) {
    try {
      const { postId } = req.body;
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(400).json({ error: "Post not found" });
      }
      const existingLike = await Like.findOne({
        where: { postId },
      });
      if (!existingLike) {
        return res.status(400).json({ error: "Like not found" });
      }
      if (existingLike.count === 0) {
        return res.status(400).json({ error: "Like count is already 0" });
      }
      existingLike.count -= 1;
      await existingLike.save();
      return res.json(existingLike);
    } catch (err) {
      return res.status(500).json({ error: "Error while creating like" });
    }
  },
  //delete like by id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const like = await Like.findByPk(id);
      if (!like) {
        return res.status(400).json({ error: "Like not found" });
      }
      await like.destroy();
      return res.status(200).json({message: "Like deleted successfully"});
    } catch (err) {
      return res.status(500).json({ error: "Error while deleting like" });
    }
  },
};

const { Comment, User, Post, Asset } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { username, postId, imageUrl, videoUrl, text, tag } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(404).send({ message: "User not found" });
      const post = await Post.findOne({ where: { id: postId } });
      if (!post) return res.status(404).send({ message: "Post not found" });

      const asset = await Asset.create({
        imageUrl,
        videoUrl,
        text,
        tag,
      });
      const comment = await Comment.create({
        userId: user.id,
        postId,
        assetId: asset.id,
      });
      res.status(201).send({ message: "Comment created", comment });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error creating comment", error: error.message });
    }
  },

 getById: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await Comment.findByPk(id, {
        include: [{ model: Asset, as: "asset" }],
      });
      if (!comment)
        return res.status(404).send({ message: "Comment not found" });

      res.status(200).send(comment);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error fetching comment", error: error.message });
    }
  },
};

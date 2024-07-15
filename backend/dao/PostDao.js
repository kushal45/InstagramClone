const { Asset, Post } = require("../models");


class PostDao {
  static async create(postData) {
    const post = await Post.create({
      userId: postData.userId,
      assetId: postData.assetId,
    });
    return post;
  }

  static async  getById(postId) {
    const post = await Post.findByPk(postId, {
      include: [
        { model: Asset, as: "asset" },
      ],
    });
    return post;
  }

  static async update(postId, updateData) {
    const post = await Post.update(updateData, {
      where: { id: postId },
      returning: true,
    });
    return post[1][0]; // Sequelize returns an array where the second element contains the affected rows
  }

  static async delete(postId) {
    const post = await Post.destroy({
      where: { id: postId },
    });
    return post;
  }

  static async list(userId, { offset = 0, limit = 10 } = {}) {
    const posts = await Post.findAll({
      where: { userId },
      include: [{ model: Asset, as: "asset" }],
      offset,
      limit,
    });
    return posts;
  }
}

module.exports =  PostDao ;
const { Op } = require("sequelize");
const { Asset, Post } = require("../../models");
const PostPool = require("../models/PostPool");

class PostDao {
  static async create(postData) {
    const post = await Post.create({
      userId: postData.userId,
      assetId: postData.assetId,
    });
    return post;
  }

  static async getById(postId) {
    const post = await Post.findByPk(postId, {
      include: [{ model: Asset, as: "asset" }],
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

  static async listByUsers(userIds, { offset = 0, limit = 10 } = {}) {
    // const posts = await Post.findAll({
    //   where: {
    //     userId: {
    //       [Op.in]: userIds,
    //     },
    //   },
    //   include: [{ model: Asset, as: "asset" }],
    //   offset,
    //   limit,
    // });
   // const posts = await PostPool.listPostsByUserids(userIds);
      const posts = await PostPool.listPostsByAttributeList([{
        userId: userIds
      }]);
    return posts;
  }

  static async listByAssets(assetIds) {
    const posts = await Post.findAll({
      where: {
        assetId: {
          [Op.in]: assetIds,
        },
      },
      include: [{ model: Asset, as: "asset" }],
    });
    return posts;
  }

  static async listByAttr(attr) {
    const whereClause = {};

    // Dynamically build the where clause based on the provided attributes
    for (const key in attr) {
      if (attr.hasOwnProperty(key)) {
        whereClause[key] = attr[key];
      }
    }

    const posts = await Post.findAll({
      where: whereClause,
      include: [{ model: Asset, as: "asset" }],
    });
    return posts;
  }
}

module.exports = PostDao;

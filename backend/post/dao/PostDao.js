const { Asset, Post } = require("../../models");


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

  static async list(userIds, { offset = 0, limit = 10 } = {}) {
    const posts = await Post.findAll({
      where: {
        userId: {
          [Op.in]: userIds
        }
      },
      include: [{ model: Asset, as: "asset" }],
      offset,
      limit,
    });
    return posts;
  }

  
static async listByAttr(attr) {
    const whereClause = {};

    // Dynamically build the where clause based on the provided attributes
    for (const key in attr) {
      if (attr.hasOwnProperty(key)) {
        whereClause[key] = attr[key];
      }else if(key === "tags"){
        whereClause[key] = {
          [Op.contains]: attr[key]
        }
      }
    }

    const posts = await Post.findAll({
      where: whereClause,
      include: [{ model: Asset, as: "asset" }],
    });
    return posts;
  }

  
}

module.exports =  PostDao ;
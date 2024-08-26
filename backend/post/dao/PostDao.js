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

  static async listByUsers(userIds, {cursor, limit } = {}) {
    const where = {
      userId: {
        [Op.in]: userIds,
      },
    };
    if (cursor) {
      const decodedCursor = Buffer.from(cursor, 'base64').toString('ascii');
      where.id = {
        [Op.lt]: decodedCursor, // Assuming 'id' is the cursor field
      };
    }
    const posts = await Post.findAll({
      where,
      include: [{ model: Asset, as: "asset" }],
      limit,
      order:["id","DESC"]
    });
    let nextCursor = null;
    if (posts.length > 0) {
      const lastPost = posts[posts.length - 1];
      nextCursor = Buffer.from(lastPost.id.toString()).toString('base64');
    }

    return {
      posts,
      nextCursor,
    };
  }

  static async listByAssets(assetIds) {
    const posts = await Post.findAll({
      where: {
        assetId: {
          [Op.in]: assetIds,
        },
      },
      include: [
        {
          model: Asset,
          as: "asset",
          required: true, // Ensures only rows with matching associations are returned
          attributes: [ 'imageUrl', 'videoUrl','tags','text'] // Select only necessary fields from Asset
        }
      ],
      attributes: ['id', 'title', 'content'], // Select only necessary fields from Post
      subQuery: false // Avoid subqueries if possible
    });
    // const posts = await PostPool.listPostsByAttributeList([
    //   {
    //     assetId: assetIds,
    //   },
    // ]);
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

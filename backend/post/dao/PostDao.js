const { Op } = require("sequelize");
const { Asset, Post } = require("../../models");
//const PostPool = require("../models/PostPool");
const Cursor = require("../../database/cursor");
const sequelize = require("../../database");
const { ErrorWithContext, ErrorContext } = require("../../errors/ErrorContext");

class PostDao {
  static async create(postData) {
    const logLocation = "PostDao.create";
    const transaction = await sequelize.transaction();
    try {
      const post = await Post.create({
        userId: postData.userId,
        assetId: postData.assetId,
      });
      await transaction.commit();
      return post;
    } catch (error) {
      await transaction.rollback();
      throw new ErrorWithContext(error,
        new ErrorContext(logLocation,{
          postId
        }),__filename
      ).wrap();
    }
    
  }

  static async getById(postId) {
    const logLocation = "PostDao.getById";
    try {
      const post = await Post.findByPk(postId, {
        include: [{ model: Asset, as: "asset" }],
      });
      return post;
    } catch (error) {
      throw new ErrorWithContext(error,
        new ErrorContext(logLocation,{
          postId
        }),__filename
      ).wrap();
    }
   
  }

  static async update(postId, updateData) {
    const logLocation ="PostDao.update";
    const transaction = await sequelize.transaction();
    try {
      const post = await Post.update(updateData, {
        where: { id: postId },
        returning: true,
      });
      await transaction.commit();
      return post[1][0]; // Sequelize returns an array where the second element contains the affected rows
    } catch (error) {
      await transaction.rollback();
      throw new ErrorWithContext(error,
        new ErrorContext(logLocation,{
          postId
        }),__filename
      ).wrap();
    }
    
  }

  static async delete(postId) {
    const logLocation ="PostDao.delete";
    const transaction = await sequelize.transaction();
    try {
      const post = await Post.destroy({
        where: { id: postId },
      });
      await transaction.commit();
      return post;
    } catch (error) {
      console.
      transaction.rollback();
      throw new ErrorWithContext(error,
        new ErrorContext(logLocation,{
          postId
        }),__filename
      ).wrap();
    }
   
  }

  static async listByUsers(userIds, {cursor, pageSize } = {}) {
    const logLocation = "PostDao.listByUsers";
    try {
      const where = {
        userId: {
          [Op.in]: userIds,
        },
      };
      if (cursor) {
        const decodedCursor = Cursor.decode(cursor);
        where.id = {
          [Op.lt]: decodedCursor.id, // Assuming 'id' is the cursor field
        };
      }
      const posts = await Post.findAll({
        where,
        include: [{ model: Asset, as: "asset" }],
        limit: pageSize,
        order: [["id", "DESC"]],
      });
      //console.log("users posts", posts);
      let nextCursor = null;
      if (posts.length > 0) {
        const lastPost = posts[posts.length - 1];
        nextCursor = Cursor.encode(lastPost);
      }
  
      return {
        posts,
        nextCursor,
      };
    } catch (error) {
      throw new ErrorWithContext(error,
        new ErrorContext(logLocation,{
          userIds,
          cursor,
          limit
        }),__filename
      ).wrap();
    }
    
  }

  static async listByAssets(assetIds, { cursor, limit } = {}) {
    if(assetIds.length === 0) {
      return {
        posts: [],
        nextCursor: null,
      };
    }
    const where = {
        assetId: {
          [Op.in]: assetIds,
        }
    }
    if (cursor) {
      const decodedCursor = Cursor.decode(cursor);
      where.id = {
        [Op.lt]: decodedCursor.id,
      };
    }
    const posts = await Post.findAll({
      where,
      include: [
        {
          model: Asset,
          as: "asset",
          required: true, // Ensures only rows with matching associations are returned
          attributes: [ 'imageUrl', 'videoUrl','tags','text'] // Select only necessary fields from Asset
        }
      ],
      attributes: ['id', 'title', 'content'], // Select only necessary fields from Post
      subQuery: false, // Avoid subqueries if possible,
      limit,
      order: [["id", "DESC"]],
    });
    let nextCursor = null;
    if (posts.length > 0) {
      const lastPost = posts[posts.length - 1];
      nextCursor = Cursor.encode(lastPost);
    }
    // const posts = await PostPool.listPostsByAttributeList([
    //   {
    //     assetId: assetIds,
    //   },
    // ]);
    return {
      posts,
      nextCursor,
    };
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

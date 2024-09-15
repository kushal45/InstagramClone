const { Op } = require("sequelize");
const { Asset, Post } = require("../../models");
//const PostPool = require("../models/PostPool");
const Cursor = require("../../database/cursor");
const sequelize = require("../../database");
const { ErrorWithContext, ErrorContext } = require("../../errors/ErrorContext");
const { InternalServerError } = require("../../errors");
const { populateSelectOptions, fetchDecodedCursor, fetchLastCursor } = require("../../util/Utility");

class PostDao {
  static async create(postData) {
    const logLocation = "PostDao.create";
    try {
      const post = await Post.create({
        userId: postData.userId,
        assetId: postData.assetId,
      });
      if(postData.transaction== null){
         throw new InternalServerError("Transaction not found");
      }
      await postData.transaction.commit();
      return post;
    } catch (error) {
      //await transaction.rollback();
      throw new ErrorWithContext(error,
        new ErrorContext(logLocation,{
          postId
        }),__filename
      )
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
      )
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
      )
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
      transaction.rollback();
      throw new ErrorWithContext(error,
        new ErrorContext(logLocation,{
          postId
        }),__filename
      )
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
      const decodedCursor = fetchDecodedCursor(cursor);
      if(decodedCursor!=null){
        where.id = {
          [Op.gt]: decodedCursor,
        };
      }      
      const posts = await Post.findAll({
        where,
        include: [{ model: Asset, as: "asset" , attributes: ['imageUrl', 'videoUrl','text']}],
        limit: pageSize,
        order: [["id", "DESC"]],
      });
      const nextCursor=fetchLastCursor(posts);
  
      return {
        posts,
        nextCursor,
      };
    } catch (error) {
      throw new ErrorWithContext(error,
        new ErrorContext(logLocation,{
          userIds,
          cursor,
          pageSize
        }),__filename
      )
    }
    
  }

  static async listByAssets(assetIds, options) {
    if(assetIds.length === 0) {
      return {
        posts: [],
        nextCursor: null,
      };
    }
    const selectOpt = {
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
      attributes: ['id', 'userId', 'assetId'],
      subQuery: false,
    };
    populateSelectOptions(selectOpt, options);
    const posts = await Post.findAll(selectOpt);
    
    const nextCursor=fetchLastCursor(posts);
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

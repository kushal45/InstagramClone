const { Op } = require("sequelize");
const { NotFoundError } = require("../../errors");
const Asset = require("../model/Asset");
const AssetPool = require("../model/AssetPool");
const logger = require("../../logger/logger");
const sequelize = require("../../database");
const {  populateSelectOptions,fetchLastCursor } = require("../../util/Utility");

class AssetDAO {
  // Method to create a new asset
  static async create({ imageUrl, videoUrl, text }) {
    const transaction = await sequelize.transaction();
    try {
      const asset = await Asset.create({ imageUrl, videoUrl, text });
      // const asset = await AssetPool.insertAsset({imageUrl, videoUrl, text });
      logger.info(`Asset created with ID: ${asset.id}`);
      return { asset, transaction };
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      //const asset = await Asset.findByPk(id);
      const asset = await AssetPool.findAssetById(id);
      logger.debug(`Asset found with asset`, asset);
      if (!asset) {
        throw new NotFoundError("Asset not found");
      }
      return asset;
    } catch (error) {
      throw error;
    }
  }

  static async findAssetIdsByTag(tags, options) {
    try {
      // default select options with which to query Assets table
      logger.debug(`Fetching assets by tags:`, tags);
      const selectOpt = {
        where: {
          tags: {
            [Op.overlap]: tags,
          },
        },
        attributes: ["id"],
        order: [["createdAt", "ASC"]],
      };
      console.log("options",selectOpt);
      populateSelectOptions(selectOpt, options);
      logger.debug(`Select options for findAssetIdsByTag`, selectOpt);
      const assets = await Asset.findAll(selectOpt);
      let assetIds = [];
      if (assets.length > 0) {
        assetIds = assets.map((asset) => asset.id); 
      }
      const nextCursor = fetchLastCursor(assets);
      logger.debug(`Asset found with assetIds`, assetIds);
      return { assetIds, nextCursor };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const [updatedRows, [updatedAsset]] = await Asset.update(updateData, {
        where: { id },
        returning: true, // This option is specific to certain SQL dialects like PostgreSQL
      });
      if (updatedRows === 0) {
        throw new NotFoundError("Asset not found or no update required");
      }
      return updatedAsset;
    } catch (error) {
      throw error;
    }
  }

  // Method to delete an asset by ID
  static async delete(id) {
    try {
      const deletedRows = await Asset.destroy({
        where: { id },
      });
      if (deletedRows === 0) {
        throw new NotFoundError("Asset not found");
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AssetDAO;

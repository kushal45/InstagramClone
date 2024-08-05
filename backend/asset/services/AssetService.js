const AssetDAO = require('../dao/AssetDao');
const logger = require('../../logger/logger');

class AssetService {
  // Create a new asset
  static async createAsset(assetData) {
    try {
      return await AssetDAO.create(assetData);
    } catch (error) {
      throw error;
    }
  }

  // Find an asset by ID
  static async findAssetById(assetId, redisClient) {
    try {
      const cacheKey = `asset:${assetId}`;
      const cachedAsset = await new Promise((resolve, reject) => {
        redisClient.get(cacheKey, (err, data) => {
          if (err) return reject(err);
          if (data) return resolve(JSON.parse(data));
          resolve(null);
        });
      });

      if (cachedAsset) {
        logger.debug('Cache hit', cachedAsset);
        return cachedAsset;
      }
      const asset = await AssetDAO.findById(assetId);
      if (asset) {
        redisClient.setex(cacheKey, 3600, JSON.stringify(asset)); // Cache for 1 hour
      }
      return asset;
    } catch (error) {
      throw error;
    }
  }

  // Update an existing asset
  static async updateAsset(assetId, updateData) {
    try {
      return await AssetDAO.update(assetId, updateData);
    } catch (error) {
      throw error;
    }
  }

  // Delete an asset by ID
  static async deleteAsset(assetId) {
    try {
      return await AssetDAO.delete(assetId);
    } catch (error) {
      throw error;
    }
  }

}

module.exports = AssetService;
const AssetDAO = require('../dao/AssetDao');

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
  static async findAssetById(assetId) {
    try {
      return await AssetDAO.findById(assetId);
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
const  Asset  = require('../model/Asset'); 

class AssetDAO {
  // Method to create a new asset
  static async create({imageUrl, videoUrl, text}) {
    try {
      const asset = await Asset.create({imageUrl, videoUrl, text });
      return asset;
    } catch (error) {
      throw error;
    }
  }

  
  static async findById(id) {
    try {
      const asset = await Asset.findByPk(id);
      if (!asset) {
        throw new Error('Asset not found');
      }
      return asset;
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
        throw new Error('Asset not found or no update required');
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
        throw new Error('Asset not found');
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AssetDAO;
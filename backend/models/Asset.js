const { Model, DataTypes } = require("sequelize");

class Asset extends Model {
    static init(sequelize) {
      super.init(
        {
          imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          videoUrl:{
            type: DataTypes.STRING,
            allowNull: true,
          },
          text: DataTypes.STRING,
          tag: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['politics', 'sports', 'technology', 'entertainment', 'science', 
              'health', 'business', 'education', 'lifestyle', 'other'],
          },
        },
        {
          sequelize,
          timestamps: true,
          underscored: false,
          createdAt: "createdAt",
          updatedAt: "updatedAt",
          tableName: "assets",
        }
      );
    }
  }
  
  module.exports = Asset;
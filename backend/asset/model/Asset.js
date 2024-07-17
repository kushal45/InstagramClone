const { Model, DataTypes } = require("sequelize");

class Asset extends Model {
  static tags= DataTypes.ENUM('politics', 'sports', 'technology', 'entertainment', 'science', 
    'health', 'business', 'education', 'lifestyle', 'other');
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
          text: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          tags: {
            type: DataTypes.ARRAY(Asset.tags),
            allowNull: true,
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

    static associate(models) {
      this.belongsTo(models.Post, {
        foreignKey: 'assetId', // 'assetId' is a column in 'Post' referencing 'id' in 'Asset'
        as: 'postasset', // Optional: Specifies an alias for when you load the association
      });

      this.belongsTo(models.Comment, { foreignKey: 'assetId', as: 'commentasset' });
     }
  }
  
  module.exports = Asset;
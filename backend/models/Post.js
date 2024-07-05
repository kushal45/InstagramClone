const { Model, DataTypes } = require("sequelize");
const Asset = require("./Asset");

class Post extends Model {
    static init(sequelize) {
      super.init(
        {
          userId:DataTypes.INTEGER,
          assetId:DataTypes.INTEGER
        },
        {
          sequelize,
          timestamps: true,
          underscored: false,
          createdAt: "createdAt",
          updatedAt: "updatedAt",
          tableName: "posts",
        }
      );
    }

    static associate(models) {
      this.belongsTo(models.Asset, {
        foreignKey: 'assetId', // 'assetId' is a column in 'Post' referencing 'id' in 'Asset'
        as: 'asset', // Optional: Specifies an alias for when you load the association
      });
     }
  }
  
  module.exports = Post;
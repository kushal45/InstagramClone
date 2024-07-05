const { Model, DataTypes } = require("sequelize");

class Post extends Model {
    static init(sequelize) {
      super.init(
        {
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          assetId:{
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          tag: {
            type: DataTypes.STRING,
            allowNull: false,
          },
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
  }
  
  module.exports = Post;
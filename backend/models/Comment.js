const { Model, DataTypes } = require("sequelize");

class Comment extends Model {
    static init(sequelize) {
      super.init(
        {
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          postId:{
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          assetId:{
            type: DataTypes.INTEGER,
            allowNull: false,
          }
        },
        {
          sequelize,
          timestamps: true,
          underscored: false,
          createdAt: "createdAt",
          updatedAt: "updatedAt",
          tableName: "comments",
        }
      );
    }
  }
  
  module.exports = Comment;
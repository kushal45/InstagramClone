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

    static associate(models) {
      this.belongsTo(models.Asset, {
        foreignKey: 'assetId', // 'assetId' is a column in 'Post' referencing 'id' in 'Asset'
        as: 'asset', // Optional: Specifies an alias for when you load the association
      });

      this.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
     }
  }
  
  module.exports = Comment;
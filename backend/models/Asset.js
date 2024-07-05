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
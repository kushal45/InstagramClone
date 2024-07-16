//generate Like model  class  by extending Model class in sequelize with postId as integer not null  and count as integer not null
//associate Like model with Post model with postId as foreign key
const { Model, DataTypes } = require("sequelize");

class Like extends Model {
    static init(sequelize) {
      super.init(
        {
          postId:DataTypes.INTEGER,
          count:DataTypes.INTEGER
        },
        {
          sequelize,
          timestamps: true,
          underscored: false,
          createdAt: "createdAt",
          updatedAt: "updatedAt",
          tableName: "likes",
        }
      );
    }
    static associate(models) {
      this.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post'
      });
    }
  }
  
  module.exports = Like;
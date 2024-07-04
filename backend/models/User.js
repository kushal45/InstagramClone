const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
      },
      {
        sequelize,
         // Enable timestamps, this is the default but shown here for clarity
         timestamps: true,
         // Define the naming convention for auto-generated columns
         underscored: false, // Ensure this is false to prevent Sequelize from auto-generating snake_case fields
         // Alternatively, define the naming convention for createdAt and updatedAt directly
         createdAt: 'createdAt',
         updatedAt: 'updatedAt',
         tableName: 'users',
      }
    );
  }

  static associate(models) {
    // this.hasMany(models.Photo, {
    //   foreignKey: "user_id",
    //   as: "photoUploads"
    // });
    // this.belongsToMany(models.Like, {
    //   foreignKey: "user_id",
    //   through: "likes",
    //   as: "userLike"
    // });
    // this.hasMany(models.Comment, {
    //   foreignKey: "user_id",
    //   as: "getComments"
    // });
    // this.hasMany(models.Follow, {
    //   foreignKey: "user_from",
    //   as: "getFollows"
    // });
    // this.hasMany(models.Follow, {
    //   foreignKey: "user_to",
    //   as: "getFollowers"
    // });
  }
}

module.exports = User;
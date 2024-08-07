const { Model, DataTypes } = require("sequelize");

class Follower extends Model {
  static init(sequelize) {
    super.init(
      {
        followingId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'users', // Assuming 'users' is the table name for User model
            key: 'id',
          },
          allowNull: false,
        },
        followerId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'users', // Assuming 'users' is the table name for User model
            key: 'id',
          },
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'followers',
        timestamps: true,
        underscored: false,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { as: 'FollowingUser', foreignKey: 'followingId' });
    this.belongsTo(models.User, { as: 'FollowerUser', foreignKey: 'followerId' });
  }
}

module.exports = Follower;
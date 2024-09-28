const { Sequelize } = require("sequelize");
const User = require("../models/User");
const UserPool = require("../models/UserPool");

class UserDAO {
  // Method to create a new user
  static async createUser(userData) {
    try {
      console.log("userData",userData);
     // const user = await User.create(userData);
      const user = await UserPool.create(userData);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Method to find a user by ID
  static async findUserById(id) {
    try {
      //const user = await User.findByPk(id);
      const user = await UserPool.findByPk(id);
      if (!user) {
        console.error("User not found");
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }

  static async findUserList(userIds){
    try {
      const users = await User.findAll({
        where: {
          id: {
            [Sequelize.Op.in]: userIds
          }
        },
        attributes: ['id','name','username']
      });
      // const users = await UserPool.findAll({
      //   where: {
      //     id: userIds
      //   }
      // });
      return users;
    } catch (error) {
      console.error("Error finding users:", error);
      throw error;
    }
  }

  // Method to update a user by ID
  static async updateUser(id, updateData) {
    try {
      const [updatedRows] = await User.update(updateData, {
        where: { id },
      });
      if (updatedRows === 0) {
        console.error("User not found or no update required");
        throw new Error("User not found or no update required");
      }
      return this.findUserById(id); // Return the updated user
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Method to delete a user by ID
  static async deleteUser(id) {
    try {
      const deletedRows = await User.destroy({
        where: { id },
      });
      if (deletedRows === 0) {
        console.error("User not found");
        throw new Error("User not found");
      }
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  static async findUserByEmailOrUsername(email, username) {
    try {
      let user = await User.findOne({
        where: { [Sequelize.Op.or]: [{ email }, { username }] },
      });
      return user;
    } catch (error) {
      console.error("Error finding user by email or username:", error);
      throw error;
    }
  }
  
  static async findUserByQuery(query,attributes) {
    try {
      let user = await User.findOne({
        where: query,
        attributes: attributes
      });
      return user;
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }

  static async fetchUserProfiles(limit,offset){
    try {
      let users = await User.findAll({
        attributes: ['id','name','username','bio'],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });
      return users;
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      throw error;
    }
  }
}

module.exports =  UserDAO;

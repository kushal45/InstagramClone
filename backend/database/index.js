const Sequelize = require("sequelize");
const ConfigDB = require("../config/db");
const { User,Asset,Post,Comment,Like} = require("../models");


// const Photo = require("../models/Photo");
// const Like = require("../models/Like");
// 
// const Follow = require("../models/Follow");

console.log("configDB", ConfigDB);
const connection = new Sequelize(ConfigDB);

User.init(connection);
 Asset.init(connection);
 Post.init(connection);
 Comment.init(connection);
// Like.init(connection);

//
// Photo.init(connection);
// Like.init(connection);
// Comment.init(connection);
// Follow.init(connection);

// Post.associate(connection.models);
// Comment.associate(connection.models);
// Like.associate(connection.models);
// User.associate(connection.models);
// Photo.associate(connection.models);
// Like.associate(connection.models);
// Comment.associate(connection.models);
// Follow.associate(connection.models);

module.exports = connection;
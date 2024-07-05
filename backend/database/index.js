const Sequelize = require("sequelize");
const ConfigDB = require("../config/db");

const User = require("../models/User");
const Asset = require("../models/Asset");
const Post = require("../models/Post");
// const Photo = require("../models/Photo");
// const Like = require("../models/Like");
// const Comment = require("../models/Comment");
// const Follow = require("../models/Follow");

console.log("configDB", ConfigDB);
const connection = new Sequelize(ConfigDB);

User.init(connection);
Asset.init(connection);
Post.init(connection);
Post.associate(connection.models);
// Photo.init(connection);
// Like.init(connection);
// Comment.init(connection);
// Follow.init(connection);

// User.associate(connection.models);
// Photo.associate(connection.models);
// Like.associate(connection.models);
// Comment.associate(connection.models);
// Follow.associate(connection.models);

module.exports = connection;
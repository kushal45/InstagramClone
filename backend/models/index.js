// export all the models of Asset, Post, User, and Comment from the models/index.js file.
module.exports = {
    Asset: require("../asset/model/Asset"),
    Post: require("../post/models/Post"),
    User: require("../user/models/User"),
    Comment: require("../comment/models/Comment"),
    Like: require("../like/models/Like"),
  };

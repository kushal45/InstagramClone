const UserDAO= require('../user/dao/UserDao');
const AssetDAO= require('../asset/dao/AssetDao');
const PostDAO= require('../post/dao/PostDao');
const CommentDAO= require('../comment/dao/CommentDao');
const LikeDAO= require('../like/dao/LikeDao');
const FollowDAO= require('../follower/dao/FollowerDao');

module.exports = { UserDAO, AssetDAO,PostDAO,CommentDAO };
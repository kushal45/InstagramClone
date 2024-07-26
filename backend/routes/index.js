const express = require('express');
const router = express.Router();
const UserRoutes= require('../user/routes');
const PostRoutes= require('../post/routes');
const CommentRoutes= require('../comment/routes');
const LikeRoutes= require('../like/routes');
const FeedRoutes= require('../feed/routes');

router.use("/user",UserRoutes);
router.use("/posts",PostRoutes);
router.use("/comments",CommentRoutes);
router.use("/like",LikeRoutes);
router.use("/feeds",FeedRoutes);

router.post('/health', (req, res) => {
    console.log('Health check');
    res.send('OK');
});

module.exports = router;


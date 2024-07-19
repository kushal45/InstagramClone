const express = require('express');
const router = express.Router();
const UserRoutes= require('../user/routes');
const PostRoutes= require('../post/routes');
const CommentRoutes= require('../comment/routes');
const LikeRoutes= require('../like/routes');

router.use(UserRoutes);
router.use(PostRoutes);
router.use(CommentRoutes);
router.use(LikeRoutes);

router.post('/health', (req, res) => {
    res.send('OK');
});

module.exports = router;


const express = require('express');
const swaggerUi = require('swagger-ui-express');
const router = express.Router();
const UserRoutes= require('../user/routes');
const PostRoutes= require('../post/routes');
const CommentRoutes= require('../comment/routes');
const LikeRoutes= require('../like/routes');
const FeedRoutes= require('../feed/routes');
const FollowerRoutes= require('../follower/routes');
const swaggerSpec = require('../doc/swaggerConfig');


router.use("/user",UserRoutes);
router.use("/posts",PostRoutes);
router.use("/comments",CommentRoutes);
router.use("/like",LikeRoutes);
router.use("/users",FollowerRoutes);
router.use("/feeds",FeedRoutes);


router.post('/health', (req, res) => {
    console.log('Health check');
    res.send('OK');
});

// Serve Swagger docs
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;


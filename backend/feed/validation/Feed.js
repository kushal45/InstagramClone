const { check } = require('express-validator');

const validateGetFeeds = [
    check('userId')
      .exists().withMessage('User ID is required')
      .isInt().withMessage('User ID must be an integer'),
    check('tags')
      .exists().withMessage('Tags are required')
      .isArray().withMessage('Tags must be an array'),
  ];


  const validateSharePost = [
    body('postId').isInt().withMessage('Post ID must be an integer'),
    check('userId').exists().isInt().withMessage('User ID should be there in the request as integer'), 
  ];
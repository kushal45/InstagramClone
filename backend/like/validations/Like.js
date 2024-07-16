const { body } = require('express-validator');

const validateLike = [
    body('postId').notEmpty().isInt().withMessage('Post ID must be an integer'),
  ];

module.exports = {
    validateLike, // Newly added validation function for "like"
};


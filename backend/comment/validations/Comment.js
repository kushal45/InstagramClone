const { body } = require('express-validator');

const validateComment = [
    body('username').notEmpty().isString().withMessage('Username must be a string'),
    body('postId').notEmpty().isInt().withMessage('Post ID must be an integer'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('videoUrl').optional().isURL().withMessage('Video URL must be a valid URL'),
    body('text').notEmpty().isString().withMessage('Text must be a string'),
    body('tag').isIn(['politics', 'sports', 'technology', 'entertainment', 'science', 'health', 'business', 'education', 'lifestyle', 'other']).withMessage('Invalid tag value'),
  ];

module.exports = {
    validateComment,
};
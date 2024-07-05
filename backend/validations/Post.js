const { body, validationResult } = require('express-validator');

const validatePost = [
  
  body('username').notEmpty().withMessage('Username is required'),
  body('imageUrl').optional().isURL().withMessage('imageUrl must be a valid URL'),
  body('videoUrl').optional().isURL().withMessage('videoUrl must be a valid URL'),
  body('text').notEmpty().withMessage('Text is required'),
  body('tag').isIn(['politics', 'sports', 'technology', 'entertainment', 'science', 'health', 'business', 'education', 'lifestyle', 'other']).withMessage('Invalid tag value'),
];

module.exports =  {validatePost} ;
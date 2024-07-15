const { body } = require('express-validator');


const validatePost = [
  body('imageUrl').optional().isURL().withMessage('imageUrl must be a valid URL'),
  body('videoUrl').optional().isURL().withMessage('videoUrl must be a valid URL'),
  body('text').notEmpty().withMessage('Text is required'),
  body('tag').isIn(['politics', 'sports', 'technology', 'entertainment', 'science', 'health', 'business', 'education', 'lifestyle', 'other']).optional().withMessage('Invalid tag value'),
];

module.exports =  {validatePost} ;
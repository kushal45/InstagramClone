const { body, query } = require('express-validator');
const xss = require('xss');


const validatePost = [
  query('cursor').optional().isString().trim().escape(),
  body('imageUrl').optional().isURL().withMessage('imageUrl must be a valid URL'),
  body('videoUrl').optional().isURL().withMessage('videoUrl must be a valid URL'),
  body('text').isString().trim().customSanitizer(value => xss(value)),,
  body('tag').isIn(['politics', 'sports', 'technology', 'entertainment', 'science', 'health', 'business', 'education', 'lifestyle', 'other']).optional().withMessage('Invalid tag value'),
];

module.exports =  {validatePost} ;
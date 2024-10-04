const { body, query } = require('express-validator');
const xss = require('xss');


const validatePost = [
  query('cursor').optional().isString().trim().escape(),
  body('imageUrl').optional().custom((value, { req }) => {
    console.log("req file",req.file);
    if(!req.file){
      return;
    }
    // You can add more checks here, such as file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('Invalid file type');
    }
    return true;
}),
  body('videoUrl').optional().custom((value, { req }) => {
  
    // You can add more checks here, such as file type and size
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv'];
    if (!allowedVideoTypes.includes(req.file.mimetype)) {
        throw new Error('Invalid file type');
    }
    return true;
}),
  body('text').isString().trim().customSanitizer(value => xss(value)),
  body('tag').isIn(['politics', 'sports', 'technology', 'entertainment', 'science', 'health', 'business', 'education', 'lifestyle', 'other']).optional().withMessage('Invalid tag value'),
];

module.exports =  {validatePost} ;
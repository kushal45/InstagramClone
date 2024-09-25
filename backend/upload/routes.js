

const express = require('express');
const router = express.Router();
const {upload} = require('../config/multer');
const path = require('path');




  router.post('/upload/image', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.status(200).send(`Image uploaded successfully: ${req.file.filename}`);
  });
  
  // Endpoint for uploading videos
  router.post('/upload/video', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
          }
          res.status(200).send(`Video uploaded successfully: ${req.file.filename}`);
    } catch (error) {
        res.status(500).send(`Video uploaded falied: `,error.message);
    }
   
  });
  
  // Serve uploaded files
  router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  module.exports = router;
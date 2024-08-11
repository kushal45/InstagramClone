const fs = require('fs');
const path = require('path');
const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../routes'); // Adjust the path as necessary
const dotenv = require('dotenv');
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

describe('File Upload Endpoints', () => {
  const testDir = path.join(__dirname, 'test-files');
  const imagePath = path.join(testDir, 'test-image.jpg');
  const videoPath = path.join(testDir, 'test-video.mp4');

  beforeAll(() => {
    // Ensure upload directories exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Create a test image file if it doesn't exist
    if (!fs.existsSync(imagePath)) {
      fs.writeFileSync(imagePath, 'dummy image content');
    }

    // Create a test video file if it doesn't exist
    if (!fs.existsSync(videoPath)) {
      fs.writeFileSync(videoPath, 'dummy video content');
    }
  });

  afterAll(() => {
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
    }
  });

  it('should upload an image', async () => {
    const res = await request(app)
      .post('/upload/image')
      .attach('file', imagePath) // Attach the file to the request
      .expect(200);

    expect(res.text).toContain('Image uploaded successfully');
  });

  it('should upload a video', async () => {
    const res = await request(app)
      .post('/upload/video')
      .attach('file', videoPath) // Attach the file to the request
      .expect(200);

    expect(res.text).toContain('Video uploaded successfully');
  });

  it('should return 400 if no file is uploaded for image', async () => {
    const res = await request(app)
      .post('/upload/image')
      .expect(400);

    expect(res.text).toContain('No file uploaded.');
  });

  it('should return 400 if no file is uploaded for video', async () => {
    const res = await request(app)
      .post('/upload/video')
      .expect(400);

    expect(res.text).toContain('No file uploaded.');
  });
});
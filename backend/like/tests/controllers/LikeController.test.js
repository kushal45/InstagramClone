const request = require('supertest');
const express = require('express');
const LikeController = require('../../controllers/LikeController');
const LikeService = require('../../services/LikeService');


jest.mock('../../services/LikeService');

const app = express();
app.use(express.json());

app.get('/show', LikeController.show);
app.post('/like', LikeController.like);
app.put('/unlike', LikeController.unlike);
app.delete('/like/:id', LikeController.delete);

let server;
beforeAll((done) => {
    server = app.listen(done);
  });
  
  afterAll((done) => {
    server.close(done);
  });




describe('LikeController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /show', () => {
    it('should get likes by post ID', async () => {
      const likes = [{ id: 1, postId: 'post1' }];
      LikeService.getLikesByPostId.mockResolvedValue(likes);

      const response = await request(app)
        .get('/show')
        .query({ postId: 'post1' })
        .expect(200);

      expect(LikeService.getLikesByPostId).toHaveBeenCalledWith('post1');
      expect(response.body).toEqual(likes);
    });

    it('should handle errors', async () => {
      LikeService.getLikesByPostId.mockRejectedValue(new Error('Test error'));

       await request(app)
        .get('/show')
        .query({ postId: 'post1' })
        .expect(500);

      expect(LikeService.getLikesByPostId).toHaveBeenCalledWith('post1');
    });
  });

  describe('POST /like', () => {
    it('should like a post', async () => {
      const like = { id: 1, postId: 'post1' };
      LikeService.likePost.mockResolvedValue(like);

      const response = await request(app)
        .post('/like')
        .send({ postId: 'post1' })
        .expect(200);

      expect(LikeService.likePost).toHaveBeenCalledWith('post1');
      expect(response.body).toEqual(like);
    });

    it('should handle errors', async () => {
      LikeService.likePost.mockRejectedValue(new Error('Test error'));

       await request(app)
        .post('/like')
        .send({ postId: 'post1' })
        .expect(500);

      expect(LikeService.likePost).toHaveBeenCalledWith('post1');
    });
  });

  describe('put /unlike', () => {
    it('should unlike a post', async () => {
      const like = { id: 1, postId: 'post1' };
      LikeService.unlikePost.mockResolvedValue(like);

      const response = await request(app)
        .put('/unlike')
        .send({ postId: 'post1' })
        .expect(200);

      expect(LikeService.unlikePost).toHaveBeenCalledWith('post1');
      expect(response.body).toEqual(like);
    });

    it('should handle errors', async () => {
      LikeService.unlikePost.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .put('/unlike')
        .send({ postId: 'post1' })
        .expect(500);

      expect(LikeService.unlikePost).toHaveBeenCalledWith('post1');
      expect(response.body).toEqual({});
    });
  });

  describe('DELETE /likes/:id', () => {
    it('should delete a like', async () => {
      const message = { message: 'Like deleted successfully' };
      LikeService.deleteLike.mockResolvedValue(message);

      const response = await request(app)
        .delete('/like/like1')
        .expect(200);

      expect(LikeService.deleteLike).toHaveBeenCalledWith('like1');
      expect(response.body).toEqual(message);
    });

    it('should handle errors', async () => {
      LikeService.deleteLike.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .delete('/like/like1')
        .expect(500);

      expect(LikeService.deleteLike).toHaveBeenCalledWith('like1');
      expect(response.body).toEqual({});
    });
  });
});
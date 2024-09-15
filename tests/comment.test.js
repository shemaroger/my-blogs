const request = require('supertest');
const app = require('../app');
const Blog = require('../Models/Blogs');
const jwt = require('jsonwebtoken');

jest.mock('../Models/Blogs');
jest.mock('jsonwebtoken');

describe('Comments API', () => {
  const mockBlog = { _id: 'blogId', comments: [] };

  beforeEach(() => {
    Blog.findById.mockResolvedValue(mockBlog);
    jwt.verify.mockResolvedValue({ _id: 'userId' });
  });

  describe('POST /blogs/:id/comments', () => {
    it('should add a comment to a blog', async () => {
      const comment = { content: 'This is a great post!' };
      const token = 'Bearer validToken';
      
      const response = await request(app)
        .post(`/blogs/${mockBlog._id}/comments`)
        .set('Authorization', token)
        .send(comment);

      expect(response.status).toBe(201);
      expect(Blog.findById).toHaveBeenCalledWith(mockBlog._id);
      expect(response.body.content).toBe(comment.content);
    });

    it('should return 404 if blog not found', async () => {
      Blog.findById.mockResolvedValue(null);
      const response = await request(app).post(`/blogs/invalidId/comments`).send({ content: 'Nice!' });
      expect(response.status).toBe(404);
    });
  });

  describe('GET /blogs/:id/comments', () => {
    it('should return all comments for a blog', async () => {
      const response = await request(app).get(`/blogs/${mockBlog._id}/comments`);
      expect(response.status).toBe(200);
    });

    it('should return 404 if blog not found', async () => {
      Blog.findById.mockResolvedValue(null);
      const response = await request(app).get(`/blogs/invalidId/comments`);
      expect(response.status).toBe(404);
    });
  });
});

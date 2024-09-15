const request = require('supertest');
const app = require('../index');
const Blog = require('../Models/Blogs');
const jwt = require('jsonwebtoken');

jest.mock('../Models/Blogs');
jest.mock('jsonwebtoken');

describe('Likes API', () => {
  const mockBlog = { _id: 'blogId', likes: ['userId'] };

  beforeEach(() => {
    Blog.findById.mockResolvedValue(mockBlog);
    jwt.verify.mockResolvedValue({ _id: 'userId' });
  });

  describe('POST /blogs/:id/like', () => {
    it('should toggle like for a blog post', async () => {
      const token = 'Bearer validToken';
      
      const response = await request(app)
        .post(`/blogs/${mockBlog._id}/like`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Blog.findById).toHaveBeenCalledWith(mockBlog._id);
      expect(response.body.includes('userId')).toBe(false); // Because the like will be removed
    });

    it('should return 404 if blog not found', async () => {
      Blog.findById.mockResolvedValue(null);
      const response = await request(app).post(`/blogs/invalidId/like`);
      expect(response.status).toBe(404);
    });
  });
});

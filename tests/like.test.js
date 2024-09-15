const request = require('supertest');
const app = require('../index');
const Blog = require('../Models/Blogs');
const jwt = require('jsonwebtoken');

jest.mock('../Models/Blogs');
jest.mock('jsonwebtoken');

describe('Likes API', () => {
  const mockBlog = { _id: 'blogId', likes: ['userId'] };

  beforeEach(() => {
    // Mock Blog.findById to return the mockBlog for the correct blog ID
    Blog.findById.mockImplementation((id) => {
      if (id === 'blogId') {
        return Promise.resolve(mockBlog);
      }
      return Promise.resolve(null);
    });
    
    jwt.verify.mockResolvedValue({ _id: 'userId' });
  });

  describe('POST /blogs/:id/like', () => {
    it('should toggle like for a blog post', async () => {
      const token = 'Bearer validToken';
      
      const response = await request(app)
        .post(`/blogs/blogId/like`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Blog.findById).toHaveBeenCalledWith('blogId');
      expect(response.body.likes.includes('userId')).toBe(false); // Assuming the like will be removed
    });

    it('should return 404 if blog not found', async () => {
      const response = await request(app).post(`/blogs/invalidId/like`);
      expect(response.status).toBe(404);
    });
  });
});

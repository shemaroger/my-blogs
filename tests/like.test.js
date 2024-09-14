const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Blog Like/Unlike API Tests', () => {
  let token;
  let blogId;
  let mongoServer;

  beforeAll(async () => {    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a user and get a token
    await request(app)
      .post('/api/users')
      .send({
        email: 'user@example.com',
        password: 'password123',
      });

    const loginRes = await request(app)
      .post('/api/userLogin')
      .send({
        email: 'user@example.com',
        password: 'password123',
      });

    token = loginRes.body.token;

    // Create a blog post
    const blogRes = await request(app)
      .post('/api/blogs')
      .set('Authorization', token)
      .send({
        title: 'Test Blog',
        content: 'This is a test blog post',
        author: 'Test Author',
      });

    blogId = blogRes.body._id;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoServer.stop();
  });

  it('should like a blog post if the user has not liked it', async () => {
    const res = await request(app)
      .post(`/api/blogs/${blogId}/toggleLike`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body).toContainEqual(expect.any(String)); // Check that the likes array contains user ID
  });

  it('should unlike a blog post if the user has already liked it', async () => {
    // Like the blog post first
    await request(app)
      .post(`/api/blogs/${blogId}/toggleLike`)
      .set('Authorization', token);

    // Unlike the blog post
    const res = await request(app)
      .post(`/api/blogs/${blogId}/toggleLike`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body).not.toContainEqual(expect.any(String)); // Check that the likes array does not contain user ID
  });

  it('should return 404 if the blog post is not found', async () => {
    const invalidBlogId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/api/blogs/${invalidBlogId}/toggleLike`)
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Blog not found');
  });

  it('should return 401 for unauthorized access', async () => {
    // Test without authorization header
    const res = await request(app)
      .post(`/api/blogs/${blogId}/toggleLike`);

    expect(res.status).toBe(401);
  });
});
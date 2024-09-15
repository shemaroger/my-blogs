// tests/like.test.js
const request = require('supertest');
const app = require('../index'); // Your app entry point
const Blog = require('../Models/Blogs');
const User = require('../Models/User');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Like API', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should like a blog post', async () => {
    const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
    const user = await User.create({ email: 'test@example.com', password: 'password123' });

    // Generate token
    const token = user.generateAuthToken();

    const res = await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Like status updated');
  });

  it('should unlike a blog post', async () => {
    const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
    const user = await User.create({ email: 'test@example.com', password: 'password123' });

    // Generate token
    const token = user.generateAuthToken();

    await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    const res = await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Like status updated');
  });
});

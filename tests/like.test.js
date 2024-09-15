const request = require('supertest');
const app = require('../index');
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

  afterEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  it('should like a blog post', async () => {
    const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
    const user = await User.create({ email: 'test1@example.com', password: 'password123' });

    // Assuming you have a JWT_SECRET in your environment variables
    const token = user.generateAuthToken ? user.generateAuthToken() : 'dummy-token';

    const res = await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Like status updated');
  });

  it('should unlike a blog post', async () => {
    const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
    const user = await User.create({ email: 'test2@example.com', password: 'password123' });

    const token = user.generateAuthToken ? user.generateAuthToken() : 'dummy-token';

    // Like the post first
    await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    // Unlike the post
    const res = await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Like status updated');
  });
});
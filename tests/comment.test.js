const request = require('supertest');
const app = require('../index');
const Blog = require('../Models/Blogs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Comment API', () => {
  let mongoServer;
  let blog;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should add a comment to a blog post', async () => {
    const res = await request(app)
      .post(`/api/blogs/${blog._id}/comments`)
      .send({ content: 'Great post!' });

    expect(res.status).toBe(200);
  });

  it('should get all comments for a blog post', async () => {
    const res = await request(app)
      .get(`/api/blogs/${blog._id}/comments`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

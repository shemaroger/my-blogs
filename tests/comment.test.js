const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('@jest/globals');

describe('Blog Comments API Tests', () => {
  let token;
  let blogId;
  let commentId;
  let mongoServer;

  beforeAll(async () => {    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(mongoUri);

    // Create a user and log in to get the token
    await request(app)
      .post('/api/users')
      .send({
        email: 'user@test.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/userLogin')
      .send({
        email: 'user@test.com',
        password: 'password123',
      });

    token = res.body.token;

    // Create a blog post
    const blogRes = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog',
        content: 'This is the content of the test blog.',
        author: 'Test Author',
      });

    blogId = blogRes.body._id;
  }, 30000); // Increased timeout for setup

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should add a comment to a blog post', async () => {
    const res = await request(app)
      .post(`/api/blogs/${blogId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a test comment.',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('content', 'This is a test comment');
    commentId = res.body._id;
  });

  it('should retrieve all comments for a blog post', async () => {
    const res = await request(app)
      .get(`/api/blogs/${blogId}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('content', 'This is a test comment');
  });

  it('should return 404 if the blog does not exist when adding a comment', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/api/blogs/${fakeId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This comment should fail.',
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Blog not found');
  });

  it('should return 404 if the blog does not exist when retrieving comments', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/blogs/${fakeId}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Blog not found');
  });
});
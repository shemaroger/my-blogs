const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Changed from '../app' to '../index'

let mongoServer;
let token;
let blogId;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);

  // Create a user and get token
  const userResponse = await request(app)
    .post('/api/users')
    .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
  
  const loginResponse = await request(app)
    .post('/api/userLogin') // Changed from '/api/login' to '/api/userLogin'
    .send({ email: 'test@example.com', password: 'password123' });
  
  token = loginResponse.body.token;
  userId = userResponse.body._id;

  // Create a blog post
  const blogResponse = await request(app)
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test Blog', content: 'Test content' });
  
  blogId = blogResponse.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Like Endpoints', () => {
  it('should toggle a like on a blog', async () => {
    const response = await request(app)
      .post(`/api/blogs/${blogId}/likes`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.likes)).toBe(true);
    expect(response.body.likes).toContain(userId);
  });

  it('should remove a like when toggled twice', async () => {
    // First like
    await request(app)
      .post(`/api/blogs/${blogId}/likes`)
      .set('Authorization', `Bearer ${token}`);
    
    // Unlike
    const response = await request(app)
      .post(`/api/blogs/${blogId}/likes`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.likes)).toBe(true);
    expect(response.body.likes).not.toContain(userId);
  });

  it('should not toggle a like without authentication', async () => {
    const response = await request(app)
      .post(`/api/blogs/${blogId}/likes`);
    expect(response.statusCode).toBe(401);
  });

  it('should not toggle a like on a non-existent blog', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/blogs/${fakeId}/likes`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });

  it('should get likes count for a blog', async () => {
    // Ensure there's a like on the blog
    await request(app)
      .post(`/api/blogs/${blogId}/likes`)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get(`/api/blogs/${blogId}/likes/count`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('count');
    expect(response.body.count).toBe(1);
  });
});
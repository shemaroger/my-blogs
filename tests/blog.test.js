const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('User and Blog API Tests', () => {
  let token; 
  let blog_id;

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
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoServer.stop();
  });

  it('should create a user and return a token upon login', async () => {
    // Create a user
    await request(app)
      .post('/api/users')
      .send({
        email: 'amina@gmail.com',
        password: 'amina123',
      });

    // Log in the user and get the token
    const res = await request(app)
      .post('/api/userLogin')
      .send({
        email: 'amina@gmail.com',
        password: 'amina123',
      });

    // Check for status code and token property
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');

    // Ensure the token starts with "Bearer"
    expect(res.body.token).toMatch(/^Bearer /);

    // Store the token for future tests
    token = res.body.token;
  }, 30000);

  it('should create a new blog post using the stored token', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', token) // Use the stored token here
      .send({
        title: 'New Blog Post',
        content: 'This is the content of the new blog post.',
        author: 'Author Name',
      });

    // Check if the blog post is successfully created
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'New Blog Post');
    expect(res.body).toHaveProperty('content', 'This is the content of the new blog post.');
    blog_id = res.body._id;
  }, 30000);

  it('should get all blog posts', async () => {
    const res = await request(app)
      .get('/api/blogs')
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200);
    
    // Check if the response body is an array
    expect(Array.isArray(res.body)).toBe(true);
    
    // Check if the array contains the blog post we seeded
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('title', 'New Blog Post');
    expect(res.body[0]).toHaveProperty('content', 'This is the content of the new blog post.');
    expect(res.body[0]).toHaveProperty('author', 'Author Name');
  });

  it('should update a blog post', async () => {
    const res = await request(app)
      .patch(`/api/blogs/${blog_id}`)
      .set('Authorization', token)
      .send({
        title: 'updated Test Blog1',
        content: 'updated This a test blog content',
        author: 'UPDATED Test Author',
      });
    
    expect(res.status).toBe(200); // Changed to 200 for successful update
    expect(res.body).toHaveProperty('title', 'updated Test Blog1');
    expect(res.body).toHaveProperty('content', 'updated This a test blog content');
  }, 30000);

  it('should delete a blog post', async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blog_id}`)
      .set('Authorization', token);
    
    expect(res.status).toBe(204); // Corrected to expect status 204 for no content
  }, 30000);

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', token)
      .send({
        title: '',
        content: 'This is a test blog content'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 401 for unauthorized access', async () => {
    const res = await request(app)
      .post('/api/blogs')  
      .send({
        title: 'Test Blog',
        content: 'This is a test blog content',
        author: 'Test Author'
      });

    expect(res.statusCode).toEqual(401);
  });
});

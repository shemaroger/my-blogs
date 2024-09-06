const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('User and Blog API Tests', () => {
  let token;
  let comment_id;
  let blog_id;
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

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.token).toMatch(/^Bearer /);

    token = res.body.token;
  }, 30000);

  it('should create a new blog post using the stored token', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', token)
      .send({
        title: 'New Blog Post',
        content: 'This is the content of the new blog post.',
        author: 'Author Name',
      });

    expect(res.statusCode).toBe(201);
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

    expect(Array.isArray(res.body)).toBe(true);
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
        title: 'Updated Test Blog',
        content: 'Updated blog content.',
        author: 'Updated Author',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Test Blog');
    expect(res.body).toHaveProperty('content', 'Updated blog content.');
    expect(res.body).toHaveProperty('author', 'Updated Author');
  }, 30000);

  it('should delete a blog post', async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blog_id}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(204);
  }, 30000);

  it('should add a comment on a blog post', async () => {
    const res = await request(app)
      .post(`/api/blogs/${blog_id}/comments`)
      .set('Authorization', token)
      .send({
        like: 1,
        comment: 'This is a test comment',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('like', 1);
    expect(res.body).toHaveProperty('comment', 'This is a test comment');
    comment_id = res.body._id;
  }, 30000);

  it('should update a comment on a blog post', async () => {
    const res = await request(app)
      .patch(`/api/comments/${comment_id}/like`)
      .set('Authorization', token)
      .send({
        like: 1,
        comment: 'Updated test comment',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('like', 1);
  }, 30000);

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', token)
      .send({
        title: '', // Invalid title
        content: 'This is a test blog content',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 401 for unauthorized access', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .send({
        title: 'Test Blog',
        content: 'This is a test blog content',
        author: 'Test Author',
      });

    expect(res.statusCode).toBe(401);
  });
});

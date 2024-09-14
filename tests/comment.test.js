const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../index'); // Adjust the path to your Express app
const Blog = require('../Models/Blogs');
const User = require('../Models/User');
const Comment = require('../Models/Comment');

let mongoServer;
let server;
let token;
let user;
let blogId;

beforeAll(async () => {
  jest.setTimeout(30000); // Increase timeout for setup
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  server = app.listen(0);

  user = new User({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
  await user.save();
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

  const blog = new Blog({ title: 'Blog for Comments', content: 'Content of the blog', author: user._id });
  await blog.save();
  blogId = blog._id;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await new Promise((resolve) => server.close(resolve));
});

describe('Comment Endpoints', () => {
  beforeEach(async () => {
    await Comment.deleteMany({}); // Clear comments before each test
  });

  it('should add a comment to a blog', async () => {
    const response = await request(server)
      .post(`/blogs/${blogId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'This is a comment.' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('content', 'This is a comment.');
  });

  it('should get all comments for a blog', async () => {
    await Comment.create({ blog: blogId, author: user._id, content: 'Comment 1' });
    await Comment.create({ blog: blogId, author: user._id, content: 'Comment 2' });

    const response = await request(server).get(`/blogs/${blogId}/comments`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: 'Comment 1' }),
        expect.objectContaining({ content: 'Comment 2' })
      ])
    );
  });

  it('should not add a comment without authentication', async () => {
    const response = await request(server)
      .post(`/blogs/${blogId}/comments`)
      .send({ content: 'This comment should not be added.' });
    expect(response.statusCode).toBe(401);
  });

  it('should not add a comment to a non-existent blog', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(server)
      .post(`/blogs/${fakeId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'This comment should not be added.' });
    expect(response.statusCode).toBe(404);
  });

  it('should delete a comment', async () => {
    const comment = await Comment.create({ blog: blogId, author: user._id, content: 'Comment to delete' });
    const response = await request(server)
      .delete(`/blogs/${blogId}/comments/${comment._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Comment deleted successfully');
  });
});

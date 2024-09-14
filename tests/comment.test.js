// tests/comment.test.js

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../index'); // Adjust the path to your Express app
const Blog = require('../Models/Blogs'); // Adjust the path to your Blog model
const User = require('../Models/User'); // Adjust the path to your User model

let mongoServer;
let mongoUri;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Comment Endpoints', () => {
  let blogId;
  let userId;
  
  beforeEach(async () => {
    // Create a test user with password
    const user = new User({ email: 'testuser@example.com', password: 'password123' });
    const savedUser = await user.save();
    userId = savedUser._id;
    
    // Create a test blog
    const blog = new Blog({ title: 'Test Blog', content: 'This is a test blog', author: 'testauthor' });
    const savedBlog = await blog.save();
    blogId = savedBlog._id;
  });

  test('should add a comment to a blog', async () => {
    // Simulate logged-in user with JWT or session handling if needed
    const response = await request(app)
      .post(`/api/blogs/${blogId}/comments`)
      .send({ content: 'This is a comment' }) // No need to send `author`, it's taken from req.user
      .expect(201);

    expect(response.body).toHaveProperty('content', 'This is a comment');
    const updatedBlog = await Blog.findById(blogId);
    expect(updatedBlog.comments.length).toBe(1);
    expect(updatedBlog.comments[0].content).toBe('This is a comment');
    expect(updatedBlog.comments[0].author.toString()).toBe(userId.toString());
  });

  test('should retrieve comments for a blog', async () => {
    const comment = { author: userId, content: 'This is a comment' };
    
    await Blog.findByIdAndUpdate(blogId, { $push: { comments: comment } });

    const response = await request(app)
      .get(`/api/blogs/${blogId}/comments`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].content).toBe('This is a comment');
  });
});

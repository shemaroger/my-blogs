const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../index');
const Blog = require('../Models/Blogs');
const User = require('../Models/User');

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
    // Create a test user with a password
    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword123' // Add a password here
    });
    const savedUser = await user.save();
    userId = savedUser._id;
    
    // Create a test blog
    const blog = new Blog({ title: 'Test Blog', content: 'This is a test blog', author: 'testauthor' });
    const savedBlog = await blog.save();
    blogId = savedBlog._id;
  });

  test('should add a comment to a blog', async () => {
    const response = await request(app)
      .post(`/api/blogs/${blogId}/comments`)
      .send({ author: userId, content: 'This is a comment' })
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Comment added successfully');
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
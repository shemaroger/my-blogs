// tests/like.test.js

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../index'); // Adjust the path to your Express app
const Blog = require('../Models/Blogs'); // Adjust the path to your Blog model

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

describe('Like Endpoints', () => {
  let blogId;
  
  beforeEach(async () => {
    // Create a test blog
    const blog = new Blog({ title: 'Test Blog', content: 'This is a test blog', author: 'testauthor' });
    const savedBlog = await blog.save();
    blogId = savedBlog._id;
  });

  test('should like a blog', async () => {
    const userId = mongoose.Types.ObjectId(); // Simulate a user ID

    const response = await request(app)
      .post(`/api/blogs/${blogId}/like`)
      .send({ userId })
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Blog liked successfully');
    const updatedBlog = await Blog.findById(blogId);
    expect(updatedBlog.likes).toContain(userId);
  });

  test('should not like a blog twice by the same user', async () => {
    const userId = mongoose.Types.ObjectId(); // Simulate a user ID

    await request(app)
      .post(`/api/blogs/${blogId}/like`)
      .send({ userId })
      .expect(200);

    const response = await request(app)
      .post(`/api/blogs/${blogId}/like`)
      .send({ userId })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'User already liked this blog');
  });
});

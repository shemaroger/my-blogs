const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../index');
const Blog = require('../Models/Blogs');

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
    const blog = new Blog({ title: 'Test Blog', content: 'This is a test blog', author: 'testauthor' });
    const savedBlog = await blog.save();
    blogId = savedBlog._id;
  });

  test('should like a blog', async () => {
    const userId = new mongoose.Types.ObjectId(); // Use 'new' keyword here

    const response = await request(app)
      .post(`/api/blogs/${blogId}/like`)
      .send({ userId })
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Blog liked successfully');
    const updatedBlog = await Blog.findById(blogId);
    expect(updatedBlog.likes).toContain(userId.toString());
  });

  test('should not like a blog twice by the same user', async () => {
    const userId = new mongoose.Types.ObjectId(); // Use 'new' keyword here

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
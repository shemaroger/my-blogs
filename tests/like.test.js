const request = require('supertest');
const app = require('../index');
const Blog = require('../Models/Blogs');
const User = require('../Models/User');

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});



describe('Like API', () => {
  let blog;
  let user;
  let token;

  beforeEach(async () => {
    blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
    user = await User.create({ email: 'test@example.com', password: 'password123' });
    token = `Bearer ${user.generateAuthToken()}`;
  });

  it('should like a blog post', async () => {
    const res = await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set('Authorization', token)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Like status updated');
  });

  it('should unlike a blog post', async () => {
    // Like the post first
    await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set('Authorization', token)
      .send();

    // Unlike the post
    const res = await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set('Authorization', token)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Like status updated');
  });
});
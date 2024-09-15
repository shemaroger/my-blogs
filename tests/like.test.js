const request = require('supertest');
const app = require('../index');
const Blog = require('../Models/Blogs');
const User = require('../Models/User');

beforeAll(async () => {    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });


describe('Like API', () => {
    it('should like a blog post', async () => {
        const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
        const user = await User.create({ email: 'test@example.com', password: 'password123' });

        const res = await request(app)
            .post(`/blogs/${blog._id}/like`)
            .set('Authorization', `Bearer ${user.token}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Like status updated');
    });

    it('should unlike a blog post', async () => {
        const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
        const user = await User.create({ email: 'test@example.com', password: 'password123' });

        // Like the post first
        await request(app)
            .post(`/blogs/${blog._id}/like`)
            .set('Authorization', `Bearer ${user.token}`)
            .send();

        // Unlike the post
        const res = await request(app)
            .post(`/blogs/${blog._id}/like`)
            .set('Authorization', `Bearer ${user.token}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Like status updated');
    });
});

// const request = require('supertest');
// const app = require('../index');
// const Blog = require('../Models/Blogs');
// const User = require('../Models/User');
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const jwt = require('jsonwebtoken');

// describe('Comment API', () => {
//   let mongoServer;
//   let blog;
//   let token;

//   beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     const mongoUri = mongoServer.getUri();
//     await mongoose.connect(mongoUri);

//     const user = await User.create({ email: 'test@example.com', password: 'password123' });
//     token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
//   });

//   beforeEach(async () => {
//     blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

//   it('should add a comment to a blog post', async () => {
//     const res = await request(app)
//       .post(`/api/blogs/${blog._id}/comments`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({ content: 'Great post!' });

//     expect(res.status).toBe(201);
//     expect(res.body).toHaveProperty('content', 'Great post!');
//   });

//   it('should get all comments for a blog post', async () => {
//     await request(app)
//       .post(`/api/blogs/${blog._id}/comments`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({ content: 'Test comment' });

//     const res = await request(app)
//       .get(`/api/blogs/${blog._id}/comments`);

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body.length).toBeGreaterThan(0);
//   });
// });
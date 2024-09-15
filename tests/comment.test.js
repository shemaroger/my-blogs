const request = require('supertest');
const app = require('../index');
const Blog = require('../Models/Blogs');

describe('Comment API', () => {
    it('should add a comment to a blog post', async () => {
        const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
        const res = await request(app)
            .post(`/blogs/${blog._id}/comments`)
            .send({ content: 'Great post!' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Comment added successfully'); // Adjust according to your API response
    }, 20000); // Set the timeout to 20 seconds (20000 ms)

    it('should get all comments for a blog post', async () => {
        const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
        const res = await request(app).get(`/blogs/${blog._id}/comments`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.comments)).toBe(true); // Adjust according to your API response
    }, 20000); // Set the timeout to 20 seconds (20000 ms)
});

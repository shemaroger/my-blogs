const request = require('supertest');
const app = require('../index');
const Blog = require('../Models/Blogs');
const User = require('../Models/User');

describe('Like API', () => {
    it('should like a blog post', async () => {
        const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
        const user = await User.create({ email: 'test@example.com', password: 'password123' });

        // Assuming token generation is required
        const token = user.generateAuthToken(); // Adjust based on your actual token generation method

        const res = await request(app)
            .post(`/blogs/${blog._id}/like`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Like status updated');
    }, 20000); // Set the timeout to 20 seconds (20000 ms)

    it('should unlike a blog post', async () => {
        const blog = await Blog.create({ title: 'Test Blog', content: 'Test Content', author: 'Test Author' });
        const user = await User.create({ email: 'test@example.com', password: 'password123' });

        // Like the post first
        const token = user.generateAuthToken(); // Adjust based on your actual token generation method
        await request(app)
            .post(`/blogs/${blog._id}/like`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        // Unlike the post
        const res = await request(app)
            .post(`/blogs/${blog._id}/like`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Like status updated');
    }, 20000); // Set the timeout to 20 seconds (20000 ms)
});

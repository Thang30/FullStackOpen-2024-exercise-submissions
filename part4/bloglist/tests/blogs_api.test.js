const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app'); // Import the express app
const config = require('../utils/config');
const api = supertest(app);
const { test, describe, after, before } = require('node:test');
const assert = require('node:assert');
const Blog = require('../models/blog');

describe('Blog API', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URI);
  });

  test('GET /api/blogs returns all blogs in JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(Array.isArray(response.body), true);
  });

  test('blogs returned have an id property instead of _id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogs = response.body;
    assert.strictEqual(blogs.length > 0, true);

    blogs.forEach(blog => {
      assert.strictEqual(blog.id !== undefined, true);
      assert.strictEqual(blog._id === undefined, true);
    });
  });

  test('POST /api/blogs creates a new blog post', async () => {
    const newBlog = {
      title: 'New Blog Title 3' ,
      author: 'New Blog Author 3',
      url: 'http://newblogurl3.com',
      likes: 14
    };

    const initialResponse = await api.get('/api/blogs');
    const initialBlogs = initialResponse.body;
    const initialLength = initialBlogs.length;

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const finalResponse = await api.get('/api/blogs');
    const finalBlogs = finalResponse.body;
    const finalLength = finalBlogs.length;

    assert.strictEqual(finalLength, initialLength + 1);

    const savedBlog = finalBlogs.find(blog => blog.title === newBlog.title);
    assert.strictEqual(savedBlog.author, newBlog.author);
    assert.strictEqual(savedBlog.url, newBlog.url);
    assert.strictEqual(savedBlog.likes, newBlog.likes);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});

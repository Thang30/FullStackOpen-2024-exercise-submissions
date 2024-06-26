const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app'); // Assuming your app starts the server
const config = require('../utils/config');
const api = supertest(app);
const { test, describe, after, before } = require('node:test');
const assert = require('node:assert');
const Blog = require('../models/blog');

describe('Blog API', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URI);
    await Blog.deleteMany({}); // Clear the database before each test suite
  });

  test('GET /api/blogs returns all blogs in JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(Array.isArray(response.body), true);
  });

  test('blogs returned have an id property instead of _id', async () => {
    const newBlog = new Blog({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0
    });

    await newBlog.save();
      
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogs = response.body;
    assert.strictEqual(blogs.length > 0, true);
      
    console.log('First blog:', blogs[0]);

    blogs.forEach(blog => {
      assert.strictEqual(blog.id !== undefined, true);
      assert.strictEqual(blog._id === undefined, true);
    });
  });

  test('POST /api/blogs creates a new blog post', async () => {
    const newBlog = {
      title: 'New Blog Title6',
      author: 'New Blog Author',
      url: 'http://newblogurl.com',
      likes: 6
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

  test('POST /api/blogs defaults likes to 0 if missing', async () => {
    const newBlog = {
      title: 'Blog Without Likes',
      author: 'Author Without Likes',
      url: 'http://nolikesblog.com'
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const savedBlog = response.body;
    assert.strictEqual(savedBlog.likes, 0);
  });

  test('POST /api/blogs responds with 400 Bad Request if title is missing', async () => {
    const newBlog = {
      author: 'Author Without Title',
      url: 'http://notitleblog.com'
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });

  test('POST /api/blogs responds with 400 Bad Request if url is missing', async () => {
    const newBlog = {
      title: 'Blog Without URL',
      author: 'Author Without URL'
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});

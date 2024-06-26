const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const config = require('../utils/config');
const api = supertest(app);
const { test, describe, after, before, beforeEach } = require('node:test');
const assert = require('node:assert');
const Blog = require('../models/blog');

describe('Blog API', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URI);
  });

  beforeEach(async () => {
    await Blog.deleteMany({});

    const initialBlogs = [
      {
        title: 'First Blog',
        author: 'First Author',
        url: 'http://firstblog.com',
        likes: 1
      },
      {
        title: 'Second Blog',
        author: 'Second Author',
        url: 'http://secondblog.com',
        likes: 2
      }
    ];

    const blogObjects = initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
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
      title: 'New Blog Title',
      author: 'New Blog Author',
      url: 'http://newblogurl.com',
      likes: 5
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

  test('DELETE /api/blogs/:id deletes a blog post', async () => {
    const initialResponse = await api.get('/api/blogs');
    const initialBlogs = initialResponse.body;
    const blogToDelete = initialBlogs[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const finalResponse = await api.get('/api/blogs');
    const finalBlogs = finalResponse.body;

    assert.strictEqual(finalBlogs.length, initialBlogs.length - 1);
    const ids = finalBlogs.map(blog => blog.id);
    assert.strictEqual(ids.includes(blogToDelete.id), false);
  });
    
  test('PATCH /api/blogs/:id updates the likes of a blog post', async () => {
    const initialResponse = await api.get('/api/blogs');
    const initialBlogs = initialResponse.body;
    const blogToUpdate = initialBlogs[0];

    const updatedLikes = { likes: blogToUpdate.likes + 1 };

    const response = await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updatedBlog = response.body;
    assert.strictEqual(updatedBlog.likes, updatedLikes.likes);
  });


  after(async () => {
    await mongoose.connection.close();
  });
});

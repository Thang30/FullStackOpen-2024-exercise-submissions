const Blog = require('../models/blog');
const blogsRouter = require('express').Router();

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  const { title, url, author, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title or URL missing' });
  }

  const newBlog = new Blog({
    title,
    url,
    author,
    likes
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;

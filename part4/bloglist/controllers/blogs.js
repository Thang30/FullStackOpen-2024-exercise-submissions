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
  const newBlog = new Blog(req.body);

  try {
    if (!newBlog) {
      return res.status(400).json({ error: 'Missing blog data' });
    }

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;

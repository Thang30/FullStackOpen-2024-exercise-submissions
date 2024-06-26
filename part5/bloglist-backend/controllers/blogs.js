const Blog = require('../models/blog');
const blogsRouter = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');


blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  const { title, author, url, likes } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const newBlog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: req.user._id
  });

  try {
    const savedBlog = await newBlog.save();
    req.user.blogs = req.user.blogs.concat(savedBlog._id);
    await req.user.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ error: 'only the creator can delete this blog' });
    }

    await Blog.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});



blogsRouter.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;

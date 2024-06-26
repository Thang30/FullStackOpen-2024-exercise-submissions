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

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Blog.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Blog not found' });
    }

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

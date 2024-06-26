const Blog = require('../models/blog');
const blogsRouter = require('express').Router()


blogsRouter.get('/', (req, res, next) => {
    Blog
        .find({})
        .then(blogs => {
            res.json(blogs)
        })
        .catch(error => next(error));
});

blogsRouter.post('/', (req, res, next) => {
    const newBlog = new Blog(req.body);

    if (!newBlog) {
        return res.status(400).json({ error: 'Missing blog data' });
    }

    newBlog
        .save()
        .then(savedBlog => res.status(201).json(savedBlog))
        .catch(error => next(error));
});


module.exports = blogsRouter;
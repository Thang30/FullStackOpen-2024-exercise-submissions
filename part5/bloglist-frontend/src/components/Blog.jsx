import React, { useState } from 'react';
import blogService from '../services/blogs'; 
import './Blog.css';

const Blog = ({ blog, updateLikes }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id 
    };
    const returnedBlog = await blogService.update(blog.id, updatedBlog);
    updateLikes(blog.id, returnedBlog);
  };

  return (
    <div style={{ padding: 10, border: '1px solid black', marginBottom: 10 }}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleDetails}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;

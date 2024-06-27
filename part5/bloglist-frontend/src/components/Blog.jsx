import React, { useState } from 'react';
import './Blog.css';

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const showRemoveButton = user && blog.user && user.username === blog.user.username;

  return (
    <div style={blogStyle} className="blog">
      <div>
        <span className="blog-title">{blog.title}</span> <span className="blog-author">{blog.author}</span>
        <button onClick={toggleVisibility} className="toggle-button">{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blog-details">
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">
            likes {blog.likes} <button onClick={() => handleLike(blog.id)}>like</button>
          </p>
          <p className="blog-user">{blog.user.name}</p>
          {showRemoveButton && (
            <button onClick={() => handleRemove(blog)} className="remove-button">remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;

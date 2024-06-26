import React, { useState } from 'react';
import './Blog.css';

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const showRemoveButton = user && blog.user && user.username === blog.user.username;

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={() => handleLike(blog.id)}>like</button>
          </p>
          <p>{blog.user.name}</p>
          {showRemoveButton && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;

import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setNotification({ content: 'Login successful', type: 'success' });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (exception) {
      setNotification({ content: 'Wrong credentials', type: 'error' });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem('loggedBlogappUser');
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      // Add the user object to the blog to ensure consistency
      returnedBlog.user = {
        id: user.id,
        username: user.username,
        name: user.name
      };
      setBlogs(blogs.concat(returnedBlog));
      setNotification({ content: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (exception) {
      setNotification({ content: 'Error adding blog', type: 'error' });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };


  const handleLike = async (id) => {
    const blog = blogs.find(b => b.id === id);
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id, // Ensure the user is represented by its id
    };

    const returnedBlog = await blogService.update(id, updatedBlog);
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog));
  };

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter(b => b.id !== blog.id));
        setNotification({ content: `Blog ${blog.title} removed`, type: 'success' });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      } catch (exception) {
        setNotification({ content: 'Error removing blog', type: 'error' });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      {user === null ?
        <Togglable buttonLabel="log in">
          <LoginForm handleLogin={handleLogin} />
        </Togglable> :
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} user={user} />
          )}
        </div>
      }
    </div>
  );
};

export default App;

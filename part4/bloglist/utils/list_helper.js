const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) return null; 

  const mostLikedBlog = blogs.reduce((favorite, current) =>
    current.likes > favorite.likes ? current : favorite
  );

  return mostLikedBlog;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

const dummy = (blogs) => {
  // This function always returns 1, regardless of the input (can be removed later)
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) return null; // Handle empty list

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

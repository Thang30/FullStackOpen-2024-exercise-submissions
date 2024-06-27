import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { describe, test, expect, vi } from 'vitest';

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '12345',
    },
  };

  const mockHandler = vi.fn();

  test('renders title and author, but not URL or number of likes by default', () => {
    render(<Blog blog={blog} />);

    const title = screen.getByText('Test Blog Title');
    const author = screen.getByText('Test Author');
    expect(title).toBeDefined();
    expect(author).toBeDefined();

    const url = screen.queryByText('http://testurl.com');
    const likes = screen.queryByText('likes 5');
    expect(url).toBeNull();
    expect(likes).toBeNull();
  });

  test('renders URL and number of likes when the button controlling the shown details has been clicked', async () => {
    render(<Blog blog={blog} />);

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const url = screen.getByText('http://testurl.com');
    const likes = screen.getByText('likes 5');
    expect(url).toBeDefined();
    expect(likes).toBeDefined();
  });

  test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    render(<Blog blog={blog} handleLike={mockHandler} />);

    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});

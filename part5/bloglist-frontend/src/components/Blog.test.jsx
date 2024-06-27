import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

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

  test('renders title and author, but not URL or number of likes by default', () => {
    render(<Blog blog={blog} />);

    // Check that title and author are rendered
    const title = screen.getByText('Test Blog Title');
    const author = screen.getByText('Test Author');
    expect(title).toBeDefined();
    expect(author).toBeDefined();

    // Check that URL and likes are not rendered by default
    const url = screen.queryByText('http://testurl.com');
    const likes = screen.queryByText('likes 5');
    expect(url).toBeNull();
    expect(likes).toBeNull();
  });

  test('renders URL and number of likes when the button controlling the shown details has been clicked', async () => {
    render(<Blog blog={blog} />);

    // Simulate user clicking the view button
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    // Check that URL and likes are rendered
    const url = screen.getByText('http://testurl.com');
    const likes = screen.getByText('likes 5');
    expect(url).toBeDefined();
    expect(likes).toBeDefined();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';
import { describe, test, expect, vi } from 'vitest';

describe('<BlogForm />', () => {
  test('calls the event handler it received as props with the right details when a new blog is created', async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={createBlog} />);

    const titleInput = screen.getByPlaceholderText('title');
    const authorInput = screen.getByPlaceholderText('author');
    const urlInput = screen.getByPlaceholderText('url');
    const createButton = screen.getByText('create');

    await user.type(titleInput, 'Test Blog');
    await user.type(authorInput, 'Test Author');
    await user.type(urlInput, 'http://testurl.com');
    await user.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
    });
  });
});

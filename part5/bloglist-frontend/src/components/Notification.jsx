import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: message.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div style={notificationStyle}>
      {message.content}
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
};

export default Notification;

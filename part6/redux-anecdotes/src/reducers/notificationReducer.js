import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    removeNotification(state, action) {
      return '';
    },
  },
});

export const { setNotification, removeNotification } = notificationSlice.actions;

export const setNotificationWithTimeout = (notification, timeout) => {
  return dispatch => {
    dispatch(setNotification(notification));
    setTimeout(() => {
      dispatch(removeNotification());
    }, timeout);
  };
};

export default notificationSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const initialState = [];

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    voteAnecdote(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find(a => a.id === id);
      if (anecdoteToChange) {
        const changedAnecdote = {
          ...anecdoteToChange,
          votes: anecdoteToChange.votes + 1
        };
        return state.map(anecdote =>
          anecdote.id !== id ? anecdote : changedAnecdote
        );
      }
    }
  }
});

export const { setAnecdotes, appendAnecdote, voteAnecdote } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteAnecdoteById = id => {
  return async dispatch => {
    await anecdoteService.updateVote(id);
    dispatch(voteAnecdote(id));
  };
};

export default anecdoteSlice.reducer;

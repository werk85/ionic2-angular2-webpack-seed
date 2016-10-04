import { HOME_KEY, homeReducer } from './home';

import { Action } from '@ngrx/store';

const logger = (reducer) => {
  return (state, action: Action) => {
    const newState = reducer(state, action);
    console.log(action);
    console.log(newState);
    return newState;
  };
};

export function getReducers(state = {}, action) {
  return {
    [HOME_KEY]: (process.env.NODE_ENV === 'production' ? homeReducer : logger(homeReducer))(state[HOME_KEY], action)
  };
}

export const reducers = {
  [HOME_KEY]: process.env.NODE_ENV === 'production' ? homeReducer : logger(homeReducer)
};

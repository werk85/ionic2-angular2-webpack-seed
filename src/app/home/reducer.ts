import { Action } from '@ngrx/store';

import { HomeState } from './interfaces';
import { INCREMENT } from './actions';

const initialState: HomeState = {
  counter: 0
};

export function homeReducer(state = initialState, action: Action): HomeState {
  switch (action.type) {
    case INCREMENT:
      return Object.assign({}, state, {
        counter: state.counter + 1
      });
    default:
      return state;
  }
}

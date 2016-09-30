import { Action } from '@ngrx/store';

import { HOME_KEY } from './constants';

export const INCREMENT = `${HOME_KEY}/INCREMENT`;
export const incrementAction = () => {
  return <Action>{ type: INCREMENT };
};

export const SUCCESS = `${HOME_KEY}/SUCCESS`;
export const successAction = () => {
  return <Action>{ type: SUCCESS };
};

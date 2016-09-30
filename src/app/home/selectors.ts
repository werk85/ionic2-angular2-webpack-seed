import { HOME_KEY } from './constants';
import { HomeState } from './interfaces';

export const getHomeState = (state): HomeState => state[HOME_KEY];
export const getCounter = (state) => getHomeState(state).counter;

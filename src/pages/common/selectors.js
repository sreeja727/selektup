import { flow } from 'lodash-es';
import { STATE_REDUCER_KEY } from './constants';

const getCommonData = (state) => state[STATE_REDUCER_KEY];

export const getCommonConfigSelector = flow(getCommonData);

const apiLoading = (state) => state.apiLoading;
export const getApiLoading = flow(
  getCommonData,
  apiLoading
);

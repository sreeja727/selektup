import { flow } from 'lodash-es';
import { STATE_REDUCER_KEY } from './constants';

const getCommonData = (state) => state[STATE_REDUCER_KEY];

export const getCommonConfigSelector = flow(getCommonData);

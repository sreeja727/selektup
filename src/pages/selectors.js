import { flow } from 'lodash-es';
import { STATE_REDUCER_KEY } from './constants';

const getTestData = (state) => state[STATE_REDUCER_KEY];

const registerData = (state) => state.registerData;
export const getRegisterData = flow(
  getTestData,
  registerData
);




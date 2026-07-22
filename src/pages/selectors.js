import { flow } from 'lodash-es';
import { STATE_REDUCER_KEY } from './constants';

const getTestData = (state) => state[STATE_REDUCER_KEY];

const registerData = (state) => state.registerData;
export const getRegisterData = flow(
  getTestData,
  registerData
);

const registerError = (state) => state.registerError;
export const getRegisterError = flow(
  getTestData,
  registerError
);

const loginData = (state) => state.loginData ;
export const getLoginData  = flow(
  getTestData,
  loginData 
);






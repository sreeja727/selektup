import { createAction } from '@reduxjs/toolkit';
import { getApiActionType } from '../utils/common';
import { STATE_REDUCER_KEY } from './constants';

const ACTIONS = {
  REGISTER:`${STATE_REDUCER_KEY}/REGISTER`,
  REGISTER_API: `${STATE_REDUCER_KEY}/REGISTER_API`,
  LOGIN:`${STATE_REDUCER_KEY}/LOGIN`,
  FORGOT_PASSWORD:`${STATE_REDUCER_KEY}/FORGOT_PASSWORD`,
  RESET_PASSWORD:`${STATE_REDUCER_KEY}/RESET_PASSWORD`
};

const ACTION_TYPES = getApiActionType(ACTIONS);

const register = createAction(ACTIONS.REGISTER);
const login = createAction(ACTIONS.LOGIN)
const forgotPassword = createAction(ACTIONS.FORGOT_PASSWORD);
const resetPassword = createAction(ACTIONS.RESET_PASSWORD);

export {
  ACTIONS,
  ACTION_TYPES,
  register,
  login,
  forgotPassword,
  resetPassword
};

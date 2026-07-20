import { createAction } from '@reduxjs/toolkit';
import { getApiActionType } from '../utils/common';
import { STATE_REDUCER_KEY } from './constants';

const ACTIONS = {
  REGISTER: `${STATE_REDUCER_KEY}/REGISTER`
};

const ACTION_TYPES = getApiActionType(ACTIONS);

const register = createAction(ACTIONS.REGISTER);

export {
  ACTIONS,
  ACTION_TYPES,
  register
};

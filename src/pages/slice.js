import { createSlice } from '@reduxjs/toolkit';
import { _ } from '../common/lodash';
import { ACTION_TYPES, ACTIONS } from './actions';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  registerData: {}
};

const registerSlice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    clearAll: () => initialState,
    setBreadcrumbSuffix: (state, { payload = [] }) => {
      _.set(state, 'breadcrumbSuffix', payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        ACTION_TYPES[ACTIONS.REGISTER][1],
        (state, { payload = {} }) => {
          _.set(state, 'registerData', payload.data || payload);
        }
      )
      ;
  }
});

export const { actions, reducer } = registerSlice;

import { createSlice } from '@reduxjs/toolkit';
import { _ } from '../common/lodash';
import { ACTION_TYPES, ACTIONS } from './actions';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  registerData: {},
  registerError: {},
  loginData:{}
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
        ACTION_TYPES[ACTIONS.REGISTER_API][0],
        (state) => {
          _.set(state, 'registerData', null);
          _.set(state, 'registerError', null);
        }
      )
      .addCase(
        ACTION_TYPES[ACTIONS.REGISTER_API][1],
        (state, { payload = {} }) => {
          _.set(state, 'registerData', payload.data || payload);
        }
      )
       .addCase(
        ACTION_TYPES[ACTIONS.LOGIN][1],
        (state, { payload = {} }) => {
          _.set(state, 'loginData', payload.data || payload);
        }
      )
      .addCase(
        ACTION_TYPES[ACTIONS.REGISTER_API][2],
        (state, { payload = {} }) => {
          _.set(state, 'registerError', payload);
        }
      )
      ;
  }
});

export const { actions, reducer } = registerSlice;

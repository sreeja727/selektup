import { createSlice } from '@reduxjs/toolkit';
import { _ } from '../common/lodash';
import { ACTION_TYPES, ACTIONS } from './actions';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  registerData: {},
  registerError: {},
  loginData:{},
  forgotPasswordData: {},
  resetPasswordData: {}
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
      .addCase(
        ACTION_TYPES[ACTIONS.FORGOT_PASSWORD][1],
        (state, { payload = {} }) => {
          _.set(state, 'forgotPasswordData', payload.data || payload);
        }
      )
      .addCase(
        ACTION_TYPES[ACTIONS.RESET_PASSWORD][1],
        (state, { payload = {} }) => {
          _.set(state, 'resetPasswordData', payload.data || payload);
        }
      )
      ;
  }
});

export const { actions, reducer } = registerSlice;

import { createSlice } from '@reduxjs/toolkit';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  apiLoading: false,
  customToast: {
    open: false, variant: 'info', message: '', title: ''
  },
  navigation: null
};

const commonSlice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    setApiLoading: (state, { payload = false }) => {
      state.apiLoading = payload;
    },
    setCustomToast: (state, { payload = {} }) => {
      state.customToast = payload;
    },
    navigateTo: (state, { payload = {} }) => {
      state.navigation = payload;
    }
  }
});

export const { actions, reducer } = commonSlice;

import { createSlice } from '@reduxjs/toolkit';
import { _ } from '../../common/lodash';
import { ACTION_TYPES, ACTIONS } from './actions';
import { ACCESS_STATUS, STATE_REDUCER_KEY } from './constants';

const initialState = {
  statusByCategory: {},
  statusLoading: false,
  requestLoading: false,
  adminRequests: [],
  adminRequestsLoading: false,
  actionLoading: false
};

const categoryAccessSlice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    clearAll: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch access status (student)
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ACCESS_STATUS][0], (state) => {
        state.statusLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ACCESS_STATUS][1], (state, { payload = {} }) => {
        const { payload: categorySlug, data: status } = payload;
        state.statusByCategory[categorySlug] = status;
        state.statusLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ACCESS_STATUS][2], (state, { payload = {} }) => {
        // Fall back to NOT_REQUESTED so the UI has a definite answer instead
        // of spinning forever when the (mock) status check fails.
        const { payload: categorySlug } = payload;
        if (categorySlug) {
          state.statusByCategory[categorySlug] = ACCESS_STATUS.NOT_REQUESTED;
        }
        state.statusLoading = false;
      })

      // Request access (student)
      .addCase(ACTION_TYPES[ACTIONS.REQUEST_ACCESS][0], (state) => {
        state.requestLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.REQUEST_ACCESS][1], (state, { payload = {} }) => {
        const { payload: requestPayload = {}, data: status } = payload;
        state.statusByCategory[requestPayload.categorySlug] = status;
        state.requestLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.REQUEST_ACCESS][2], (state) => {
        state.requestLoading = false;
      })

      // Fetch all requests (admin)
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_REQUESTS][0], (state) => {
        state.adminRequestsLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_REQUESTS][1], (state, { payload = {} }) => {
        state.adminRequests = payload.data || [];
        state.adminRequestsLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_REQUESTS][2], (state) => {
        state.adminRequestsLoading = false;
      })

      // Approve / reject (admin)
      .addCase(ACTION_TYPES[ACTIONS.APPROVE_REQUEST][0], (state) => {
        state.actionLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.APPROVE_REQUEST][1], (state, { payload = {} }) => {
        applyAdminStatusUpdate(state, payload.data, ACCESS_STATUS.APPROVED);
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.APPROVE_REQUEST][2], (state) => {
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.REJECT_REQUEST][0], (state) => {
        state.actionLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.REJECT_REQUEST][1], (state, { payload = {} }) => {
        applyAdminStatusUpdate(state, payload.data, ACCESS_STATUS.REJECTED);
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.REJECT_REQUEST][2], (state) => {
        state.actionLoading = false;
      });
  }
});

function applyAdminStatusUpdate(state, record, status) {
  if (!record) return;
  const index = _.findIndex(state.adminRequests, (r) => r.id === record.id);
  if (index >= 0) {
    state.adminRequests[index] = { ...state.adminRequests[index], status };
  }
}

export const { actions, reducer } = categoryAccessSlice;

import { createSlice } from '@reduxjs/toolkit';
import { _ } from '../common/lodash';
import { ACTION_TYPES, ACTIONS } from './actions';
import { ACCESS_STATUS, STATE_REDUCER_KEY } from './constants';

const initialState = {
  // auth
  registerData: {},
  registerError: {},
  loginData: {},
  forgotPasswordData: {},
  resetPasswordData: {},

  // common (loading / toast / navigation)
  apiLoading: false,
  customToast: {
    open: false, variant: 'info', message: '', title: ''
  },
  navigation: null,

  // category access
  statusByCategory: {},
  statusLoading: false,
  requestLoading: false,
  adminRequests: [],
  adminRequestsLoading: false,
  actionLoading: false,
  testCategories: [],
  testCategoriesLoading: false
};

const pagesSlice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    clearAll: () => initialState,
    setBreadcrumbSuffix: (state, { payload = [] }) => {
      _.set(state, 'breadcrumbSuffix', payload);
    },
    setApiLoading: (state, { payload = false }) => {
      state.apiLoading = payload;
    },
    setCustomToast: (state, { payload = {} }) => {
      state.customToast = payload;
    },
    navigateTo: (state, { payload = {} }) => {
      state.navigation = payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
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
        ACTION_TYPES[ACTIONS.REGISTER_API][2],
        (state, { payload = {} }) => {
          _.set(state, 'registerError', payload);
        }
      )

      // Login
      .addCase(
        ACTION_TYPES[ACTIONS.LOGIN][1],
        (state, { payload = {} }) => {
          _.set(state, 'loginData', payload.data || payload);
        }
      )

      // Forgot / reset password
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
      })

      // Fetch test categories (GET /api/test-categories)
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORIES][0], (state) => {
        state.testCategoriesLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORIES][1], (state, { payload = {} }) => {
        state.testCategories = payload.data?.data || [];
        state.testCategoriesLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORIES][2], (state) => {
        state.testCategoriesLoading = false;
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

export const { actions, reducer } = pagesSlice;

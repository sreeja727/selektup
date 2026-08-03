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
  testCategoriesLoading: false,
  testCategoryDetail: null,
  testCategoryDetailLoading: false,
  testDetail: null,
  testDetailLoading: false,
  requestCategoryAccessLoading: false,
  adminStudents: [],
  adminStudentsLoading: false,
  adminStudentsTotalPages: 0,
  adminStudentsPageSize: 10,
  adminStudentsCurrentPage: 0,
  adminEnquiries: [],
  adminEnquiriesLoading: false,
  contactSubmitting: false,
  contactSuccessMessage: '',
  contactError: '',

  // mock test attempt (frontend-only until a submit-attempt backend exists)
  testAttempt: null,
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
    },
    setTestAttempt: (state, { payload = null }) => {
      state.testAttempt = payload;
    },
    clearContactStatus: (state) => {
      state.contactSuccessMessage = '';
      state.contactError = '';
    },
    setStudentBlocked: (state, { payload = {} }) => {
      const { id, blocked } = payload;
      const index = state.adminStudents.findIndex((s) => s.id === id);
      if (index >= 0) {
        state.adminStudents[index] = { ...state.adminStudents[index], blocked };
      }
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
        state.adminRequests = payload.data?.data || [];
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
        applyAdminStatusUpdate(state, payload.data?.data);
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.APPROVE_REQUEST][2], (state) => {
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.REJECT_REQUEST][0], (state) => {
        state.actionLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.REJECT_REQUEST][1], (state, { payload = {} }) => {
        applyAdminStatusUpdate(state, payload.data?.data);
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
      })

      // Fetch test category detail (GET /api/test-categories/{id})
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORY_DETAIL][0], (state) => {
        state.testCategoryDetailLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORY_DETAIL][1], (state, { payload = {} }) => {
        state.testCategoryDetail = payload.data?.data || null;
        state.testCategoryDetailLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORY_DETAIL][2], (state) => {
        state.testCategoryDetailLoading = false;
      })

      // Fetch test detail (GET /api/test-categories/{categoryId}/tests/{testId})
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_DETAIL][0], (state) => {
        state.testDetailLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_DETAIL][1], (state, { payload = {} }) => {
        state.testDetail = payload.data?.data || null;
        state.testDetailLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_DETAIL][2], (state) => {
        state.testDetailLoading = false;
      })

      // Request category access (POST /api/test-categories/{id}/request-access)
      .addCase(ACTION_TYPES[ACTIONS.REQUEST_CATEGORY_ACCESS][0], (state) => {
        state.requestCategoryAccessLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.REQUEST_CATEGORY_ACCESS][1], (state) => {
        // The endpoint returns no body, so reflect the pending state locally
        // rather than waiting on a re-fetch of the detail endpoint.
        if (state.testCategoryDetail) {
          state.testCategoryDetail.accessStatus = ACCESS_STATUS.PENDING;
        }
        state.requestCategoryAccessLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.REQUEST_CATEGORY_ACCESS][2], (state) => {
        state.requestCategoryAccessLoading = false;
      })

      // Fetch admin students (GET /api/admin/students/paginated)
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENTS][0], (state) => {
        state.adminStudentsLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENTS][1], (state, { payload = {} }) => {
        const raw = payload.data?.data;
        // Today the backend returns a flat array (no pagination metadata).
        // If it later returns a Spring-style page ({ content, totalPages, ... }),
        // that shape is picked up here without needing another change.
        const {
          content = [], totalPages = 0, pageSize = 10, currentPage = 0
        } = Array.isArray(raw) ? { content: raw } : (raw || {});
        state.adminStudents = content;
        state.adminStudentsTotalPages = totalPages;
        state.adminStudentsPageSize = pageSize;
        state.adminStudentsCurrentPage = currentPage;
        state.adminStudentsLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENTS][2], (state) => {
        state.adminStudentsLoading = false;
      })

      // Block / unblock student (admin) — the actual adminStudents update
      // happens via setStudentBlocked, dispatched from the saga once the
      // POST resolves, since these endpoints return no student data back.
      .addCase(ACTION_TYPES[ACTIONS.BLOCK_STUDENT][0], (state) => {
        state.actionLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.BLOCK_STUDENT][1], (state) => {
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.BLOCK_STUDENT][2], (state) => {
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.UNBLOCK_STUDENT][0], (state) => {
        state.actionLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.UNBLOCK_STUDENT][1], (state) => {
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.UNBLOCK_STUDENT][2], (state) => {
        state.actionLoading = false;
      })

      // Fetch admin enquiries (GET /api/admin/enquiries)
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_ENQUIRIES][0], (state) => {
        state.adminEnquiriesLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_ENQUIRIES][1], (state, { payload = {} }) => {
        state.adminEnquiries = payload.data?.data || [];
        state.adminEnquiriesLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_ENQUIRIES][2], (state) => {
        state.adminEnquiriesLoading = false;
      })

      // Submit contact/enquiry form (POST /api/home/contact)
      .addCase(ACTION_TYPES[ACTIONS.SUBMIT_CONTACT][0], (state) => {
        state.contactSubmitting = true;
        state.contactSuccessMessage = '';
        state.contactError = '';
      })
      .addCase(ACTION_TYPES[ACTIONS.SUBMIT_CONTACT][1], (state, { payload = {} }) => {
        state.contactSuccessMessage = payload.data?.message || "Thanks! We'll get back to you soon.";
        state.contactSubmitting = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.SUBMIT_CONTACT][2], (state, { payload = {} }) => {
        const errorData = payload.errorData || {};
        state.contactError = errorData.message || errorData.errorMessage || 'Something went wrong. Please try again.';
        state.contactSubmitting = false;
      });
  }
});

function applyAdminStatusUpdate(state, record) {
  if (!record) return;
  const index = _.findIndex(state.adminRequests, (r) => r.requestId === record.requestId);
  if (index >= 0) {
    state.adminRequests[index] = { ...state.adminRequests[index], ...record };
  }
}

export const { actions, reducer } = pagesSlice;

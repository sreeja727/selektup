import { createAction } from '@reduxjs/toolkit';
import { getApiActionType } from '../utils/common';
import { STATE_REDUCER_KEY } from './constants';

const ACTIONS = {
  REGISTER: `${STATE_REDUCER_KEY}/REGISTER`,
  REGISTER_API: `${STATE_REDUCER_KEY}/REGISTER_API`,
  LOGIN: `${STATE_REDUCER_KEY}/LOGIN`,
  FORGOT_PASSWORD: `${STATE_REDUCER_KEY}/FORGOT_PASSWORD`,
  RESET_PASSWORD: `${STATE_REDUCER_KEY}/RESET_PASSWORD`,

  FETCH_ACCESS_STATUS: `${STATE_REDUCER_KEY}/FETCH_ACCESS_STATUS`,
  REQUEST_ACCESS: `${STATE_REDUCER_KEY}/REQUEST_ACCESS`,
  FETCH_ADMIN_REQUESTS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_REQUESTS`,
  APPROVE_REQUEST: `${STATE_REDUCER_KEY}/APPROVE_REQUEST`,
  REJECT_REQUEST: `${STATE_REDUCER_KEY}/REJECT_REQUEST`,
  FETCH_TEST_CATEGORIES: `${STATE_REDUCER_KEY}/FETCH_TEST_CATEGORIES`
};

const ACTION_TYPES = getApiActionType(ACTIONS);

const register = createAction(ACTIONS.REGISTER);
const login = createAction(ACTIONS.LOGIN);
const forgotPassword = createAction(ACTIONS.FORGOT_PASSWORD);
const resetPassword = createAction(ACTIONS.RESET_PASSWORD);

// payload: categorySlug
const fetchAccessStatus = createAction(ACTIONS.FETCH_ACCESS_STATUS);
// payload: { categorySlug, categoryTitle, categoryPrice }
const requestAccess = createAction(ACTIONS.REQUEST_ACCESS);
// payload: none (admin)
const fetchAdminRequests = createAction(ACTIONS.FETCH_ADMIN_REQUESTS);
// payload: requestId (admin)
const approveRequest = createAction(ACTIONS.APPROVE_REQUEST);
// payload: requestId (admin)
const rejectRequest = createAction(ACTIONS.REJECT_REQUEST);
// payload: none - fetches the live list from GET /api/test-categories
const fetchTestCategories = createAction(ACTIONS.FETCH_TEST_CATEGORIES);

export {
  ACTIONS,
  ACTION_TYPES,
  register,
  login,
  forgotPassword,
  resetPassword,
  fetchAccessStatus,
  requestAccess,
  fetchAdminRequests,
  approveRequest,
  rejectRequest,
  fetchTestCategories
};

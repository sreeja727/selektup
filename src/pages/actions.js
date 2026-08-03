import { createAction } from '@reduxjs/toolkit';
import { getApiActionType } from '../utils/common';
import { STATE_REDUCER_KEY } from './constants';

const ACTIONS = {
  REGISTER: `${STATE_REDUCER_KEY}/REGISTER`,
  REGISTER_API: `${STATE_REDUCER_KEY}/REGISTER_API`,
  LOGIN: `${STATE_REDUCER_KEY}/LOGIN`,
  FORGOT_PASSWORD: `${STATE_REDUCER_KEY}/FORGOT_PASSWORD`,
  VERIFY_OTP: `${STATE_REDUCER_KEY}/VERIFY_OTP`,
  RESET_PASSWORD: `${STATE_REDUCER_KEY}/RESET_PASSWORD`,

  FETCH_ACCESS_STATUS: `${STATE_REDUCER_KEY}/FETCH_ACCESS_STATUS`,
  REQUEST_ACCESS: `${STATE_REDUCER_KEY}/REQUEST_ACCESS`,
  FETCH_ADMIN_REQUESTS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_REQUESTS`,
  APPROVE_REQUEST: `${STATE_REDUCER_KEY}/APPROVE_REQUEST`,
  REJECT_REQUEST: `${STATE_REDUCER_KEY}/REJECT_REQUEST`,
  FETCH_TEST_CATEGORIES: `${STATE_REDUCER_KEY}/FETCH_TEST_CATEGORIES`,
  FETCH_TEST_CATEGORY_DETAIL: `${STATE_REDUCER_KEY}/FETCH_TEST_CATEGORY_DETAIL`,
  REQUEST_CATEGORY_ACCESS: `${STATE_REDUCER_KEY}/REQUEST_CATEGORY_ACCESS`,
  FETCH_ADMIN_STUDENTS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_STUDENTS`,
  BLOCK_STUDENT: `${STATE_REDUCER_KEY}/BLOCK_STUDENT`,
  UNBLOCK_STUDENT: `${STATE_REDUCER_KEY}/UNBLOCK_STUDENT`,
  FETCH_ADMIN_ENQUIRIES: `${STATE_REDUCER_KEY}/FETCH_ADMIN_ENQUIRIES`
};

const ACTION_TYPES = getApiActionType(ACTIONS);

const register = createAction(ACTIONS.REGISTER);
const login = createAction(ACTIONS.LOGIN);
const forgotPassword = createAction(ACTIONS.FORGOT_PASSWORD);
const verifyOtp = createAction(ACTIONS.VERIFY_OTP);
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
// payload: categoryId - fetches real detail + tests[] + accessStatus from
// GET /api/test-categories/{id} (requires auth)
const fetchTestCategoryDetail = createAction(ACTIONS.FETCH_TEST_CATEGORY_DETAIL);
// payload: categoryId - POST /api/test-categories/{id}/request-access
const requestCategoryAccess = createAction(ACTIONS.REQUEST_CATEGORY_ACCESS);
// payload: { search, page, size } (admin) - fetches a page from GET /api/admin/students/paginated
const fetchAdminStudents = createAction(ACTIONS.FETCH_ADMIN_STUDENTS);
// payload: studentId (admin) - POST /api/admin/students/{id}/block
const blockStudent = createAction(ACTIONS.BLOCK_STUDENT);
// payload: studentId (admin) - POST /api/admin/students/{id}/unblock
const unblockStudent = createAction(ACTIONS.UNBLOCK_STUDENT);
// payload: none (admin) - fetches the live list from GET /api/admin/enquiries
const fetchAdminEnquiries = createAction(ACTIONS.FETCH_ADMIN_ENQUIRIES);

export {
  ACTIONS,
  ACTION_TYPES,
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  fetchAccessStatus,
  requestAccess,
  fetchAdminRequests,
  approveRequest,
  rejectRequest,
  fetchTestCategories,
  fetchTestCategoryDetail,
  requestCategoryAccess,
  fetchAdminStudents,
  blockStudent,
  unblockStudent,
  fetchAdminEnquiries
};

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
  CHANGE_PASSWORD: `${STATE_REDUCER_KEY}/CHANGE_PASSWORD`,
  FETCH_ACCESS_STATUS: `${STATE_REDUCER_KEY}/FETCH_ACCESS_STATUS`,
  REQUEST_ACCESS: `${STATE_REDUCER_KEY}/REQUEST_ACCESS`,
  FETCH_ADMIN_REQUESTS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_REQUESTS`,
  APPROVE_REQUEST: `${STATE_REDUCER_KEY}/APPROVE_REQUEST`,
  REJECT_REQUEST: `${STATE_REDUCER_KEY}/REJECT_REQUEST`,
  FETCH_TEST_CATEGORIES: `${STATE_REDUCER_KEY}/FETCH_TEST_CATEGORIES`,
  FETCH_TEST_CATEGORY_DETAIL: `${STATE_REDUCER_KEY}/FETCH_TEST_CATEGORY_DETAIL`,
  FETCH_TEST_DETAIL: `${STATE_REDUCER_KEY}/FETCH_TEST_DETAIL`,
  REQUEST_CATEGORY_ACCESS: `${STATE_REDUCER_KEY}/REQUEST_CATEGORY_ACCESS`,
  FETCH_ADMIN_STUDENTS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_STUDENTS`,
  BLOCK_STUDENT: `${STATE_REDUCER_KEY}/BLOCK_STUDENT`,
  UNBLOCK_STUDENT: `${STATE_REDUCER_KEY}/UNBLOCK_STUDENT`,
  FETCH_ADMIN_ENQUIRIES: `${STATE_REDUCER_KEY}/FETCH_ADMIN_ENQUIRIES`,
  SUBMIT_CONTACT: `${STATE_REDUCER_KEY}/SUBMIT_CONTACT`,
  FETCH_TEST_QUESTIONS: `${STATE_REDUCER_KEY}/FETCH_TEST_QUESTIONS`,
  SUBMIT_TEST: `${STATE_REDUCER_KEY}/SUBMIT_TEST`,
  START_TEST: `${STATE_REDUCER_KEY}/START_TEST`,
  FETCH_SUBMISSION: `${STATE_REDUCER_KEY}/FETCH_SUBMISSION`,
  FETCH_SUBMISSION_REVIEW: `${STATE_REDUCER_KEY}/FETCH_SUBMISSION_REVIEW`,
  ADD_QUESTION: `${STATE_REDUCER_KEY}/ADD_QUESTION`,
  UPDATE_QUESTION: `${STATE_REDUCER_KEY}/UPDATE_QUESTION`,
  BULK_UPLOAD_QUESTIONS: `${STATE_REDUCER_KEY}/BULK_UPLOAD_QUESTIONS`,
  DELETE_QUESTION: `${STATE_REDUCER_KEY}/DELETE_QUESTION`,
  DELETE_ALL_QUESTIONS: `${STATE_REDUCER_KEY}/DELETE_ALL_QUESTIONS`,
  FETCH_ADMIN_DASHBOARD_SUMMARY: `${STATE_REDUCER_KEY}/FETCH_ADMIN_DASHBOARD_SUMMARY`,
  DOWNLOAD_QUESTION_TEMPLATE: `${STATE_REDUCER_KEY}/DOWNLOAD_QUESTION_TEMPLATE`,
  FETCH_ADMIN_TEST_QUESTIONS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_TEST_QUESTIONS`,
  FETCH_ADMIN_RESULTS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_RESULTS`,
  FETCH_ADMIN_RESULT_DETAIL: `${STATE_REDUCER_KEY}/FETCH_ADMIN_RESULT_DETAIL`,
  FETCH_ADMIN_TESTS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_TESTS`
};

const ACTION_TYPES = getApiActionType(ACTIONS);

const register = createAction(ACTIONS.REGISTER);
const login = createAction(ACTIONS.LOGIN);
const forgotPassword = createAction(ACTIONS.FORGOT_PASSWORD);
const verifyOtp = createAction(ACTIONS.VERIFY_OTP);
const resetPassword = createAction(ACTIONS.RESET_PASSWORD);
const changePassword = createAction(ACTIONS.CHANGE_PASSWORD);
const fetchAccessStatus = createAction(ACTIONS.FETCH_ACCESS_STATUS);
const requestAccess = createAction(ACTIONS.REQUEST_ACCESS);
const fetchAdminRequests = createAction(ACTIONS.FETCH_ADMIN_REQUESTS);
const approveRequest = createAction(ACTIONS.APPROVE_REQUEST);
const rejectRequest = createAction(ACTIONS.REJECT_REQUEST);
const fetchTestCategories = createAction(ACTIONS.FETCH_TEST_CATEGORIES);
const fetchTestCategoryDetail = createAction(ACTIONS.FETCH_TEST_CATEGORY_DETAIL);
const fetchTestDetail = createAction(ACTIONS.FETCH_TEST_DETAIL);
const requestCategoryAccess = createAction(ACTIONS.REQUEST_CATEGORY_ACCESS);
const fetchAdminStudents = createAction(ACTIONS.FETCH_ADMIN_STUDENTS);
const blockStudent = createAction(ACTIONS.BLOCK_STUDENT);
const unblockStudent = createAction(ACTIONS.UNBLOCK_STUDENT);
const fetchAdminEnquiries = createAction(ACTIONS.FETCH_ADMIN_ENQUIRIES);
const submitContact = createAction(ACTIONS.SUBMIT_CONTACT);
const fetchTestQuestions = createAction(ACTIONS.FETCH_TEST_QUESTIONS);
const fetchAdminTestQuestions = createAction(ACTIONS.FETCH_ADMIN_TEST_QUESTIONS);
const submitTest = createAction(ACTIONS.SUBMIT_TEST);
const startTest = createAction(ACTIONS.START_TEST);
const fetchSubmission = createAction(ACTIONS.FETCH_SUBMISSION);
const fetchSubmissionReview = createAction(ACTIONS.FETCH_SUBMISSION_REVIEW);
const addQuestion = createAction(ACTIONS.ADD_QUESTION);
const updateQuestion = createAction(ACTIONS.UPDATE_QUESTION);
const bulkUploadQuestions = createAction(ACTIONS.BULK_UPLOAD_QUESTIONS);
const deleteQuestion = createAction(ACTIONS.DELETE_QUESTION);
const deleteAllQuestions = createAction(ACTIONS.DELETE_ALL_QUESTIONS);
const fetchAdminDashboardSummary = createAction(ACTIONS.FETCH_ADMIN_DASHBOARD_SUMMARY);
const downloadQuestionTemplate = createAction(ACTIONS.DOWNLOAD_QUESTION_TEMPLATE);
const fetchAdminResults = createAction(ACTIONS.FETCH_ADMIN_RESULTS);
const fetchAdminResultDetail = createAction(ACTIONS.FETCH_ADMIN_RESULT_DETAIL);
// payload: none (admin) - GET /api/admin/tests, the flat list of every mock
// test across every category (admin-scoped, unlike GET /api/test-categories/{id}
// which only returns tests[] once the calling account itself has approved
// access — wrong for populating an admin filter dropdown).
const fetchAdminTests = createAction(ACTIONS.FETCH_ADMIN_TESTS);

export {
  ACTIONS,
  ACTION_TYPES,
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  fetchAccessStatus,
  requestAccess,
  fetchAdminRequests,
  approveRequest,
  rejectRequest,
  fetchTestCategories,
  fetchTestCategoryDetail,
  fetchTestDetail,
  requestCategoryAccess,
  fetchAdminStudents,
  blockStudent,
  unblockStudent,
  fetchAdminEnquiries,
  submitContact,
  fetchTestQuestions,
  submitTest,
  startTest,
  fetchSubmission,
  fetchSubmissionReview,
  addQuestion,
  updateQuestion,
  bulkUploadQuestions,
  deleteQuestion,
  deleteAllQuestions,
  fetchAdminDashboardSummary,
  downloadQuestionTemplate,
  fetchAdminTestQuestions,
  fetchAdminResults,
  fetchAdminResultDetail,
  fetchAdminTests
};

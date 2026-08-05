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
  FETCH_ADMIN_TEST_QUESTIONS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_TEST_QUESTIONS`
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
// payload: { categoryId, testId } - fetches real duration/marks/cutoff/negative
// marking from GET /api/test-categories/{categoryId}/tests/{testId} (requires auth)
const fetchTestDetail = createAction(ACTIONS.FETCH_TEST_DETAIL);
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
// payload: { name, email, phone, district, message } - POST /api/home/contact
const submitContact = createAction(ACTIONS.SUBMIT_CONTACT);
// payload: testId - GET /api/tests/{testId}/questions (student-facing exam view)
const fetchTestQuestions = createAction(ACTIONS.FETCH_TEST_QUESTIONS);
// payload: { testId, search } (admin) - GET /api/admin/tests/{testId}/questions,
// the admin-only listing (includes the correct answer, unlike the student one
// above) that backs the Questions list/Add "next number" tracking.
const fetchAdminTestQuestions = createAction(ACTIONS.FETCH_ADMIN_TEST_QUESTIONS);
// payload: { testId, answers } - POST /api/tests/{testId}/submit
const submitTest = createAction(ACTIONS.SUBMIT_TEST);
// payload: testId - POST /api/tests/{testId}/start, fired when the exam
// screen mounts to mark a new attempt as started.
const startTest = createAction(ACTIONS.START_TEST);
// payload: submissionId - GET /api/tests/submissions/{submissionId}, the
// persisted result summary for a completed attempt (backs the Result screen
// when reached via a submissionId instead of local Redux state).
const fetchSubmission = createAction(ACTIONS.FETCH_SUBMISSION);
// payload: submissionId - GET /api/tests/submissions/{submissionId}/review,
// the per-question breakdown for a completed attempt (backs the Review screen).
const fetchSubmissionReview = createAction(ACTIONS.FETCH_SUBMISSION_REVIEW);
// payload: { testId, question } (admin) - POST /api/admin/tests/{testId}/questions,
// adds one question under a mock test; the backend returns the saved question
// plus the next question number so the frontend never has to track all ~100
// questions of a test itself.
const addQuestion = createAction(ACTIONS.ADD_QUESTION);
// payload: { testId, questionId, question } (admin) - PUT /api/tests/{testId}/questions/{questionId}
const updateQuestion = createAction(ACTIONS.UPDATE_QUESTION);
// payload: { testId, file } (admin) - POST /api/admin/tests/{testId}/questions/bulk,
// a single multipart .xlsx upload the backend parses, validates and saves in
// one go, returning the created questions (and any row-level errors).
const bulkUploadQuestions = createAction(ACTIONS.BULK_UPLOAD_QUESTIONS);
// payload: { testId, questionId } (admin) - DELETE /api/tests/{testId}/questions/{questionId}
const deleteQuestion = createAction(ACTIONS.DELETE_QUESTION);
// payload: { testId, questionIds, isFiltered } (admin) - when isFiltered is
// false (no active search/type filter), the saga calls the real bulk
// DELETE /api/admin/tests/{testId}/questions endpoint (deletes everything,
// unconditionally). When isFiltered is true, that endpoint can't scope to a
// subset, so the saga instead loops DELETE .../questions/{questionId} once
// per id in questionIds.
const deleteAllQuestions = createAction(ACTIONS.DELETE_ALL_QUESTIONS);
// payload: none (admin) - GET /api/admin/dashboard/summary
const fetchAdminDashboardSummary = createAction(ACTIONS.FETCH_ADMIN_DASHBOARD_SUMMARY);
// payload: testId (admin) - GET /api/admin/tests/{testId}/questions/template,
// downloads the backend-generated .xlsx template for bulk upload.
const downloadQuestionTemplate = createAction(ACTIONS.DOWNLOAD_QUESTION_TEMPLATE);

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
  fetchAdminTestQuestions
};

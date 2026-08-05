import { getUser } from '../utils/auth';
import { REQUEST_METHOD } from '../common/constant';
import { API_URL } from '../common/url';
import { ACTION_TYPES, ACTIONS } from './actions';
import { ACCESS_STATUS, REQUESTS_STORAGE_KEY } from './constants';
import * as questionsApi from './questionTypes';

/* ===========================
   AUTH APIs
=========================== */

const registerApi = (data) => {
  return {
    url: API_URL.REGISTER,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.REGISTER_API],
      data,
    },
  };
};

const loginApi = (data) => {
  return {
    url: API_URL.LOGIN,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.LOGIN],
      data,
    },
  };
};

const forgotPasswordApi = (data) => {
  return {
    url: API_URL.FORGOT_PASSWORD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.FORGOT_PASSWORD],
      data,
    },
  };
};

const verifyOtpApi = (data) => {
  return {
    url: API_URL.VERIFY_OTP,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.VERIFY_OTP],
      data,
    },
  };
};

const resetPasswordApi = (data) => {
  return {
    url: API_URL.RESET_PASSWORD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.RESET_PASSWORD],
      data,
    },
  };
};

/* ===========================
   CATEGORY ACCESS APIs
=========================== */

// Stands in for the backend today: every student's category-access request
// lives here, keyed by categorySlug + mobile, so the admin table and the
// student's own status check read the exact same source of truth.
// Swap these functions for real axios calls (see registerApi/loginApi above
// for the pattern) once the Spring Boot endpoints exist — actions/saga/slice
// won't need to change.

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeAll(requests) {
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

function requestId(categorySlug, mobile) {
  return `${categorySlug}::${mobile}`;
}

async function getAccessStatus(categorySlug) {
  const user = getUser();
  // Without a real identifier every such user would collide on the same
  // "<slug>::undefined" record, making one approval look like everyone's
  // approval. Treat a missing identifier as "can't tell yet", not a match.
  if (!user || !user.mobile) return ACCESS_STATUS.NOT_REQUESTED;
  const found = readAll().find(
    (r) => r.id === requestId(categorySlug, user.mobile)
  );
  return found ? found.status : ACCESS_STATUS.NOT_REQUESTED;
}

async function submitAccessRequest({ categorySlug, categoryTitle, categoryPrice }) {
  const user = getUser();
  if (!user) throw new Error('You must be logged in to request access.');
  if (!user.mobile) throw new Error('Your session is missing a mobile number — please log in again.');

  const all = readAll();
  const id = requestId(categorySlug, user.mobile);
  const existingIndex = all.findIndex((r) => r.id === id);
  const record = {
    id,
    studentName: user.fullName,
    // The login response only returns a mobile number, not a separate email
    // address — the backend would need to return one for this to be populated.
    studentEmail: '',
    studentMobile: user.mobile,
    categorySlug,
    categoryTitle,
    categoryPrice,
    status: ACCESS_STATUS.PENDING,
    requestedDate: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    all[existingIndex] = record;
  } else {
    all.push(record);
  }
  writeAll(all);
  return record.status;
}

// Real Spring Boot backend (POST /api/admin/category-access/{requestId}/approve
// and .../reject) — replaces the setRequestStatus() localStorage mock above.
function approveCategoryAccessApi(requestId) {
  return {
    url: `${API_URL.ADMIN_CATEGORY_ACCESS}/${requestId}/approve`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.APPROVE_REQUEST]
    }
  };
}

function rejectCategoryAccessApi(requestId) {
  return {
    url: `${API_URL.ADMIN_CATEGORY_ACCESS}/${requestId}/reject`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.REJECT_REQUEST]
    }
  };
}

// This one hits the real Spring Boot backend (GET /api/test-categories),
// following the same request-descriptor shape as registerApi/loginApi above —
// consumed via utils/http's handleAPIRequest in saga.js, not the mock helpers above.
function getTestCategoriesApi() {
  return {
    url: API_URL.TEST_CATEGORIES,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORIES]
    }
  };
}

// Real Spring Boot backend (GET /api/test-categories/{id}) — category detail,
// including the real tests list and the current student's accessStatus.
// Requires auth (returns 403 without a token), unlike getTestCategoriesApi above.
function getTestCategoryDetailApi(categoryId) {
  return {
    url: `${API_URL.TEST_CATEGORIES}/${categoryId}`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORY_DETAIL]
    }
  };
}

// Real Spring Boot backend (GET /api/test-categories/{categoryId}/tests/{testId}) —
// per-test detail: duration, marks, cut-off, negative marking. Requires auth.
function getTestDetailApi({ categoryId, testId }) {
  return {
    url: `${API_URL.TEST_CATEGORIES}/${categoryId}/tests/${testId}`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_TEST_DETAIL]
    }
  };
}

// Real Spring Boot backend (POST /api/test-categories/{id}/request-access) —
// the real counterpart to submitAccessRequest() above; returns no data body.
function requestCategoryAccessApi(categoryId) {
  return {
    url: `${API_URL.TEST_CATEGORIES}/${categoryId}/request-access`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.REQUEST_CATEGORY_ACCESS]
    }
  };
}

// Real Spring Boot backend (GET /api/admin/category-access) — replaces the
// getAllRequests() localStorage mock above for the admin requests table.
// Same request-descriptor shape as getTestCategoriesApi.
function getAdminCategoryAccessApi() {
  return {
    url: API_URL.ADMIN_CATEGORY_ACCESS,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_REQUESTS]
    }
  };
}

// Real Spring Boot backend (GET /api/admin/students/paginated?search=&page=&size=) —
// same shape again, with query params for search + pagination.
function getAdminStudentsApi({ search = '', page = 0, size = 10 } = {}) {
  return {
    url: API_URL.ADMIN_STUDENTS_PAGINATED,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENTS],
      params: { search, page, size }
    }
  };
}

// Real Spring Boot backend (POST /api/admin/students/{id}/block and .../unblock).
function blockStudentApi(id) {
  return {
    url: `${API_URL.ADMIN_STUDENTS}/${id}/block`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.BLOCK_STUDENT]
    }
  };
}

function unblockStudentApi(id) {
  return {
    url: `${API_URL.ADMIN_STUDENTS}/${id}/unblock`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.UNBLOCK_STUDENT]
    }
  };
}

// Real Spring Boot backend (POST /api/home/contact) — the public contact/
// enquiry form submission. Same request-descriptor shape as registerApi/
// loginApi above.
function submitContactApi(data) {
  return {
    url: API_URL.HOME_CONTACT,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.SUBMIT_CONTACT],
      data
    }
  };
}

// Real Spring Boot backend (GET /api/tests/{testId}/questions) — the question
// set for a specific test (student-facing exam view). Requires auth.
function getTestQuestionsApi(testId) {
  return {
    url: `${API_URL.TESTS}/${testId}/questions`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_TEST_QUESTIONS]
    }
  };
}

// Real Spring Boot backend (GET /api/admin/tests/{testId}/questions?type=&search=) —
// the admin-only question list for a mock test (includes correctOption,
// unlike the student-facing endpoint above). Confirmed via /v3/api-docs:
// listQuestions takes optional `type` (a QUESTION_TYPES key) and `search`
// query params; response is { data: { total, questions: [AdminQuestionDto] } }.
// Raw rows are normalized to the app's canonical question shape in slice.js.
function getAdminTestQuestionsApi({ testId, search, type }) {
  return {
    url: `${API_URL.ADMIN_TESTS}/${testId}/questions`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_TEST_QUESTIONS],
      params: { ...(search ? { search } : {}), ...(type ? { type } : {}) }
    }
  };
}

// Real Spring Boot backend (POST /api/tests/{testId}/submit) — submits the
// student's answers and gets back the computed score/result.
function submitTestApi({ testId, answers }) {
  return {
    url: `${API_URL.TESTS}/${testId}/submit`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.SUBMIT_TEST],
      data: { answers }
    }
  };
}

// Real Spring Boot backend (POST /api/tests/{testId}/start) — marks a new
// attempt as started for the given test (student-facing). Fired when the
// exam screen mounts; the UI doesn't block on its result.
function startTestApi(testId) {
  return {
    url: `${API_URL.TESTS}/${testId}/start`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.START_TEST]
    }
  };
}

// Real Spring Boot backend (GET /api/tests/submissions/{submissionId}) — the
// persisted result summary for a completed attempt, expected to mirror
// submitTestApi's response shape (totalMarks, cutOffMarks, correct, wrong,
// unanswered, penalty, score, ...). Backs the Result screen when it's
// reached via a submissionId (real tests) instead of local Redux state.
function getSubmissionApi(submissionId) {
  return {
    url: `${API_URL.TESTS}/submissions/${submissionId}`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_SUBMISSION]
    }
  };
}

// Real Spring Boot backend (GET /api/tests/submissions/{submissionId}/review) —
// the per-question breakdown (question/options/correctOption/selectedOption)
// for a completed attempt. Backs the Review screen the same way
// getSubmissionApi backs Result.
function getSubmissionReviewApi(submissionId) {
  return {
    url: `${API_URL.TESTS}/submissions/${submissionId}/review`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_SUBMISSION_REVIEW]
    }
  };
}

// Converts the app's canonical question shape (see questionTypes.js) to the
// backend's wire shape — confirmed against the live OpenAPI spec
// (GET /v3/api-docs, CreateQuestionRequest schema) for all 7 types.
// questionTypes.js is the single place a future question TYPE needs a
// new branch.
const toWireQuestion = questionsApi.toWireQuestion;

// Real Spring Boot backend (POST /api/admin/tests/{testId}/questions) — adds a
// single question under the given mock test (admin only). Expected response:
// { data: { question, nextQuestionNumber } }, letting the admin form move on
// to the next question without tracking all ~100 of them itself.
function addQuestionApi({ testId, question }) {
  return {
    url: `${API_URL.ADMIN_TESTS}/${testId}/questions`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.ADD_QUESTION],
      data: toWireQuestion(question)
    }
  };
}

// Real Spring Boot backend (PUT /api/admin/tests/{testId}/questions/{questionId}) —
// edits an existing question (admin only), same body shape as addQuestionApi.
// Expected response: { data: { question } }.
function updateQuestionApi({ testId, questionId, question }) {
  return {
    url: `${API_URL.ADMIN_TESTS}/${testId}/questions/${questionId}`,
    method: REQUEST_METHOD.PUT,
    payload: {
      types: ACTION_TYPES[ACTIONS.UPDATE_QUESTION],
      data: toWireQuestion(question)
    }
  };
}

// Real Spring Boot backend (POST /api/admin/tests/{testId}/questions/bulk,
// multipart) — uploads one .xlsx file (the same columns as the downloadable
// template) and lets the backend parse, validate and save every row under the
// mock test in one go. Expected response:
// { data: { questions: [...], errors: [{ row, message }] } }, so the admin
// sees both what was saved and which rows failed.
function bulkUploadQuestionsApi({ testId, file }) {
  const formData = new FormData();
  formData.append('file', file);
  return {
    url: `${API_URL.ADMIN_TESTS}/${testId}/questions/bulk`,
    method: REQUEST_METHOD.MULTIPART,
    payload: {
      types: ACTION_TYPES[ACTIONS.BULK_UPLOAD_QUESTIONS],
      data: formData
    }
  };
}

// Real Spring Boot backend (GET /api/admin/tests/{testId}/questions/template) —
// downloads the backend-generated .xlsx template admins fill in for bulk
// upload. Uses the existing blob-download path in utils/http.js (isDocument),
// so the response comes back as a Blob rather than JSON.
function downloadQuestionTemplateApi(testId) {
  return {
    url: `${API_URL.ADMIN_TESTS}/${testId}/questions/template`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.DOWNLOAD_QUESTION_TEMPLATE],
      isDocument: true
    }
  };
}

// Real Spring Boot backend (DELETE /api/admin/tests/{testId}/questions/{questionId}) —
// admin-only. Returns no body; the saga removes the row from adminTestQuestions
// locally (same pattern as blockStudentApi/unblockStudentApi above).
function deleteQuestionApi({ testId, questionId }) {
  return {
    url: `${API_URL.ADMIN_TESTS}/${testId}/questions/${questionId}`,
    method: REQUEST_METHOD.DELETE,
    payload: {
      types: ACTION_TYPES[ACTIONS.DELETE_QUESTION]
    }
  };
}

// Real Spring Boot backend (DELETE /api/admin/tests/{testId}/questions) —
// confirmed via /v3/api-docs: no body, no query params — unconditionally
// deletes every question under the test. Only usable when the admin isn't
// looking at a filtered subset (see deleteAllQuestionsSaga in saga.js),
// since there's no way to scope it to a search/type filter.
function deleteAllQuestionsApi(testId) {
  return {
    url: `${API_URL.ADMIN_TESTS}/${testId}/questions`,
    method: REQUEST_METHOD.DELETE,
    payload: {
      types: ACTION_TYPES[ACTIONS.DELETE_ALL_QUESTIONS]
    }
  };
}

// Real Spring Boot backend (GET /api/admin/enquiries) — same shape again.
function getAdminEnquiriesApi() {
  return {
    url: API_URL.ADMIN_ENQUIRIES,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_ENQUIRIES]
    }
  };
}

// Real Spring Boot backend (GET /api/admin/dashboard/summary) — the Admin
// Dashboard's headline counts. Expected response:
// { success, message, data: { testSeriesCount, mockTestsCount, studentsCount } }.
function getAdminDashboardSummaryApi() {
  return {
    url: API_URL.ADMIN_DASHBOARD_SUMMARY,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_DASHBOARD_SUMMARY]
    }
  };
}



export {
  registerApi,
  loginApi,
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,

  getAccessStatus,
  submitAccessRequest,
  getTestCategoriesApi,
  getTestCategoryDetailApi,
  getTestDetailApi,
  requestCategoryAccessApi,
  getAdminCategoryAccessApi,
  approveCategoryAccessApi,
  rejectCategoryAccessApi,
  getAdminStudentsApi,
  blockStudentApi,
  unblockStudentApi,
  getAdminEnquiriesApi,
  submitContactApi,
  getTestQuestionsApi,
  getAdminTestQuestionsApi,
  submitTestApi,
  startTestApi,
  getSubmissionApi,
  getSubmissionReviewApi,
  addQuestionApi,
  updateQuestionApi,
  bulkUploadQuestionsApi,
  deleteQuestionApi,
  deleteAllQuestionsApi,
  getAdminDashboardSummaryApi,
  downloadQuestionTemplateApi,
};

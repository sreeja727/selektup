import { getUser } from '../utils/auth';
import { REQUEST_METHOD } from '../common/constant';
import { API_URL } from '../common/url';
import { ACTION_TYPES, ACTIONS } from './actions';
import { ACCESS_STATUS, REQUESTS_STORAGE_KEY } from './constants';
import * as questionsApi from './questionTypes';


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


const forgotPasswordApi = ({ mobile }) => {
  return {
    url: API_URL.FORGOT_PASSWORD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.FORGOT_PASSWORD],
      data: { mobile },
    },
  };
};


const verifyOtpApi = ({ mobile, otp }) => {
  return {
    url: API_URL.VERIFY_OTP,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.VERIFY_OTP],
      data: { mobile, otp },
    },
  };
};


const resetPasswordApi = ({ resetToken, password }) => {
  return {
    url: API_URL.RESET_PASSWORD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.RESET_PASSWORD],
      data: { resetToken, newPassword: password },
    },
  };
};


const changePasswordApi = ({ currentPassword, newPassword }) => {
  return {
    url: API_URL.CHANGE_PASSWORD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.CHANGE_PASSWORD],
      data: { currentPassword, newPassword },
    },
  };
};


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


function getTestCategoriesApi() {
  return {
    url: API_URL.TEST_CATEGORIES,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORIES]
    }
  };
}


function getTestCategoryDetailApi(categoryId) {
  return {
    url: `${API_URL.TEST_CATEGORIES}/${categoryId}`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORY_DETAIL]
    }
  };
}


function getTestDetailApi({ categoryId, testId }) {
  return {
    url: `${API_URL.TEST_CATEGORIES}/${categoryId}/tests/${testId}`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_TEST_DETAIL]
    }
  };
}


function requestCategoryAccessApi(categoryId) {
  return {
    url: `${API_URL.TEST_CATEGORIES}/${categoryId}/request-access`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.REQUEST_CATEGORY_ACCESS]
    }
  };
}

function getAdminCategoryAccessApi() {
  return {
    url: API_URL.ADMIN_CATEGORY_ACCESS,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_REQUESTS]
    }
  };
}

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

// Real Spring Boot backend (GET /api/admin/results) — paginated list of
// submitted test results (admin only), confirmed via OpenAPI. Same
// Page<T>-as-Map response shape as getAdminStudentsApi above.
function getAdminResultsApi({ search = '', categoryId, testId, page = 0, size = 10 } = {}) {
  return {
    url: API_URL.ADMIN_RESULTS,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULTS],
      params: {
        search, page, size,
        ...(categoryId ? { categoryId } : {}),
        ...(testId ? { testId } : {}),
      }
    }
  };
}

// Real Spring Boot backend (GET /api/admin/results/{submissionId}) — the
// full per-submission detail (admin only), confirmed via OpenAPI
// (AdminResultDetailDto).
function getAdminResultDetailApi(submissionId) {
  return {
    url: `${API_URL.ADMIN_RESULTS}/${submissionId}`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_DETAIL]
    }
  };
}

// Real Spring Boot backend (GET /api/admin/tests) — every mock test across
// every category, admin-scoped (no per-user access gating, unlike
// getTestCategoryDetailApi's tests[]). Powers the admin Results page's Mock
// Test filter.
function getAdminTestsApi() {
  return {
    url: API_URL.ADMIN_TESTS,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_TESTS]
    }
  };
}

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

function getTestQuestionsApi(testId) {
  return {
    url: `${API_URL.TESTS}/${testId}/questions`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_TEST_QUESTIONS]
    }
  };
}

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

function startTestApi(testId) {
  return {
    url: `${API_URL.TESTS}/${testId}/start`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.START_TEST]
    }
  };
}

function getSubmissionApi(submissionId) {
  return {
    url: `${API_URL.TESTS}/submissions/${submissionId}`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_SUBMISSION]
    }
  };
}


function getSubmissionReviewApi(submissionId) {
  return {
    url: `${API_URL.TESTS}/submissions/${submissionId}/review`,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_SUBMISSION_REVIEW]
    }
  };
}


const toWireQuestion = questionsApi.toWireQuestion;


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


function deleteQuestionApi({ testId, questionId }) {
  return {
    url: `${API_URL.ADMIN_TESTS}/${testId}/questions/${questionId}`,
    method: REQUEST_METHOD.DELETE,
    payload: {
      types: ACTION_TYPES[ACTIONS.DELETE_QUESTION]
    }
  };
}


function deleteAllQuestionsApi(testId) {
  return {
    url: `${API_URL.ADMIN_TESTS}/${testId}/questions`,
    method: REQUEST_METHOD.DELETE,
    payload: {
      types: ACTION_TYPES[ACTIONS.DELETE_ALL_QUESTIONS]
    }
  };
}

function getAdminEnquiriesApi() {
  return {
    url: API_URL.ADMIN_ENQUIRIES,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_ADMIN_ENQUIRIES]
    }
  };
}


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
  changePasswordApi,

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
  getAdminResultsApi,
  getAdminResultDetailApi,
  getAdminTestsApi,
};

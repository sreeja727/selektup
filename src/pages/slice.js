import { createSlice } from '@reduxjs/toolkit';
import { _ } from '../common/lodash';
import { ACTION_TYPES, ACTIONS } from './actions';
import { ACCESS_STATUS, STATE_REDUCER_KEY } from './constants';
import {
  fromWireQuestion, getTypeConfig, QUESTION_KIND, OPTION_LETTERS,
} from './questionTypes';

// Normalizes a raw question row from the backend into the canonical
// { id, type, text, options, correctOptionIndexes, ... } shape every
// Questions screen (List/Add/Edit/View) and TestScreen read — see
// questionTypes.js for the per-type field mapping (confirmed against the
// live OpenAPI spec for all 7 types).
const normalizeQuestion = fromWireQuestion;

// Normalizes a raw ReviewQuestionDto row (confirmed via /v3/api-docs:
// { questionId, questionType, questionText, optionA..D, correctOption,
// correctNumericAnswer, numericTolerance, selectedOption, textAnswerGiven,
// numericAnswerGiven, correct, skipped, needsManualGrading, manualScore,
// explanation } — three separate given-answer fields, one per kind, mirroring
// AnswerEntry) into the canonical question shape plus a `selected` value in
// the shape QuestionAnswerInput/questionTypes' isAnswered/isCorrect/
// getSelectedAnswerLabel expect (a string for single-select/text-answer/
// numeric-answer, a string[] for multi-select, decoded from the
// comma-separated letters) — Review.jsx reads this shape for both the
// real-backend path (this function) and the local mock-attempt path (built
// directly in TestScreen.jsx).
function normalizeSubmissionQuestion(raw) {
  if (!raw) return raw;
  const question = fromWireQuestion({ ...raw, id: raw.questionId });
  const config = getTypeConfig(question.type);

  let selected = null;
  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    selected = raw.numericAnswerGiven ?? null;
  } else if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    selected = raw.textAnswerGiven || raw.selectedOption || null;
  } else if (config.kind === QUESTION_KIND.MULTI_SELECT) {
    selected = String(raw.selectedOption || '')
      .split(',')
      .map((letter) => OPTION_LETTERS.indexOf(letter.trim().toUpperCase()))
      .filter((i) => i >= 0)
      .map((i) => question.options[i])
      .filter(Boolean);
  } else {
    const idx = OPTION_LETTERS.indexOf(String(raw.selectedOption ?? '').trim().toUpperCase());
    selected = idx >= 0 ? question.options[idx] : null;
  }

  return {
    ...question,
    question: question.text,
    selected,
    needsManualGrading: raw.needsManualGrading ?? false,
    manualScore: raw.manualScore ?? null,
  };
}

// Normalizes a raw SubmissionResultDto (confirmed via OpenAPI: { submissionId,
// score, totalMarks, totalQuestions, attemptedCount, correctCount, wrongCount,
// skippedCount, negativeMarks, cutOffMarks, passed, submittedAt }) into the
// { correct, wrong, unanswered, penalty, ... } shape Result.jsx and
// TestScreen.jsx's local-fallback path already read.
function normalizeSubmissionResult(raw) {
  if (!raw) return raw;
  return {
    submissionId: raw.submissionId,
    totalQuestions: raw.totalQuestions,
    totalMarks: raw.totalMarks,
    cutOffMarks: raw.cutOffMarks,
    attempted: raw.attemptedCount ?? 0,
    correct: raw.correctCount ?? 0,
    wrong: raw.wrongCount ?? 0,
    unanswered: raw.skippedCount ?? 0,
    penalty: raw.negativeMarks ?? 0,
    score: raw.score ?? 0,
    passed: raw.passed,
    submittedAt: raw.submittedAt,
  };
}

const initialState = {
  // auth
  registerData: {},
  registerError: {},
  loginData: {},
  forgotPasswordData: {},
  resetPasswordData: {},
  changePasswordData: {},

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

  // real test questions/submit (GET/POST /api/tests/{testId}/...) — student-facing
  testQuestions: [],
  testQuestionsLoading: false,
  submitTestLoading: false,
  submitTestResult: null,

  // start test attempt (real, student-facing) - POST /api/tests/{testId}/start
  startTestLoading: false,

  // submission result summary (real, student-facing), fetched by id instead
  // of relying on local Redux state - GET /api/tests/submissions/{submissionId}
  submission: null,
  submissionLoading: false,

  // submission review detail (real, student-facing) -
  // GET /api/tests/submissions/{submissionId}/review
  submissionReview: null,
  submissionReviewLoading: false,

  // admin test questions list (GET /api/admin/tests/{testId}/questions) — backs
  // the Questions list/Add "next number" tracking; kept separate from
  // testQuestions above since it's a different endpoint with different auth/shape.
  adminTestQuestions: [],
  adminTestQuestionsTotal: 0,
  adminTestQuestionsLoading: false,

  // add question (admin) - POST /api/tests/{testId}/questions
  addQuestionLoading: false,
  addQuestionResult: null,
  addQuestionError: '',

  // update question (admin) - PUT /api/tests/{testId}/questions/{questionId}
  updateQuestionLoading: false,
  updateQuestionResult: null,
  updateQuestionError: '',

  // bulk upload questions (admin) - POST /api/tests/{testId}/questions/bulk
  bulkUploadLoading: false,
  bulkUploadResult: null,
  bulkUploadError: '',

  // delete question (admin) - DELETE /api/tests/{testId}/questions/{questionId}
  deleteQuestionLoading: false,

  // delete all questions (admin) - loops the single-delete endpoint above,
  // since there's no bulk-delete endpoint on the backend yet.
  deleteAllQuestionsLoading: false,

  // dashboard summary (admin) - GET /api/admin/dashboard/summary
  adminDashboardSummary: null,
  adminDashboardSummaryLoading: false,

  // download question template (admin) - GET /api/admin/tests/{testId}/questions/template
  questionTemplateLoading: false,
  questionTemplateFile: null,
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
    clearChangePasswordStatus: (state) => {
      state.changePasswordData = {};
    },
    // The approve/reject endpoints return no body (ApiResponseVoid), so the
    // saga dispatches this with the id + new status it already knows once
    // the request succeeds (same pattern as setStudentBlocked below).
    setAdminRequestStatus: (state, { payload = {} }) => {
      const { requestId, status } = payload;
      const index = state.adminRequests.findIndex((r) => r.requestId === requestId);
      if (index >= 0) {
        state.adminRequests[index] = { ...state.adminRequests[index], status };
      }
    },
    setStudentBlocked: (state, { payload = {} }) => {
      const { id, blocked } = payload;
      const index = state.adminStudents.findIndex((s) => s.id === id);
      if (index >= 0) {
        state.adminStudents[index] = { ...state.adminStudents[index], blocked };
      }
    },
    // DELETE returns no body, so the saga dispatches this with the id it
    // already knows once the request succeeds (same pattern as setStudentBlocked).
    removeQuestion: (state, { payload = {} }) => {
      const { questionId } = payload;
      const before = state.adminTestQuestions.length;
      state.adminTestQuestions = state.adminTestQuestions.filter((q) => String(q.id) !== String(questionId));
      state.adminTestQuestionsTotal -= before - state.adminTestQuestions.length;
    },
    clearBulkUploadStatus: (state) => {
      state.bulkUploadResult = null;
      state.bulkUploadError = '';
    },
    setDeleteAllQuestionsLoading: (state, { payload = false }) => {
      state.deleteAllQuestionsLoading = payload;
    },
    // DELETE /api/admin/tests/{testId}/questions returns no body — the saga
    // dispatches this once it succeeds, since it deletes everything
    // unconditionally (see deleteAllQuestionsSaga in saga.js).
    clearAdminTestQuestions: (state) => {
      state.adminTestQuestions = [];
      state.adminTestQuestionsTotal = 0;
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
      // Change password (logged-in student) — POST /api/auth/change-password.
      // Written the same way as forgotPasswordData so ChangePassword.jsx can
      // react to { success, message } (e.g. show "Current password is
      // incorrect" inline under that field, not just as a toast).
      .addCase(
        ACTION_TYPES[ACTIONS.CHANGE_PASSWORD][1],
        (state, { payload = {} }) => {
          _.set(state, 'changePasswordData', payload.data || payload);
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

      // Approve / reject (admin) — both return ApiResponseVoid (no body), so
      // the actual adminRequests update happens via setAdminRequestStatus,
      // dispatched from the saga once the request succeeds.
      .addCase(ACTION_TYPES[ACTIONS.APPROVE_REQUEST][0], (state) => {
        state.actionLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.APPROVE_REQUEST][1], (state) => {
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.APPROVE_REQUEST][2], (state) => {
        state.actionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.REJECT_REQUEST][0], (state) => {
        state.actionLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.REJECT_REQUEST][1], (state) => {
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
      })

      // Fetch test questions (GET /api/tests/{testId}/questions)
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_QUESTIONS][0], (state) => {
        state.testQuestionsLoading = true;
        // Clear out the previous test's questions so they can't briefly
        // flash while the next test's set is still loading.
        state.testQuestions = [];
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_QUESTIONS][1], (state, { payload = {} }) => {
        const raw = payload.data?.data;
        // Defensive: accept either a flat array or the { total, questions }
        // wrapper confirmed for the admin listing, in case this endpoint uses
        // the same envelope.
        const list = Array.isArray(raw) ? raw : (raw?.questions || []);
        state.testQuestions = list.map(normalizeQuestion);
        state.testQuestionsLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_QUESTIONS][2], (state) => {
        state.testQuestionsLoading = false;
      })

      // Submit test (POST /api/tests/{testId}/submit)
      .addCase(ACTION_TYPES[ACTIONS.SUBMIT_TEST][0], (state) => {
        state.submitTestLoading = true;
        state.submitTestResult = null;
      })
      .addCase(ACTION_TYPES[ACTIONS.SUBMIT_TEST][1], (state, { payload = {} }) => {
        state.submitTestResult = normalizeSubmissionResult(payload.data?.data) || {};
        state.submitTestLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.SUBMIT_TEST][2], (state) => {
        state.submitTestLoading = false;
      })

      // Start test attempt (POST /api/tests/{testId}/start) — fire-and-forget,
      // the UI doesn't block on it.
      .addCase(ACTION_TYPES[ACTIONS.START_TEST][0], (state) => {
        state.startTestLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.START_TEST][1], (state) => {
        state.startTestLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.START_TEST][2], (state) => {
        state.startTestLoading = false;
      })

      // Submission result summary (GET /api/tests/submissions/{submissionId})
      .addCase(ACTION_TYPES[ACTIONS.FETCH_SUBMISSION][0], (state) => {
        state.submissionLoading = true;
        state.submission = null;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_SUBMISSION][1], (state, { payload = {} }) => {
        state.submission = normalizeSubmissionResult(payload.data?.data) || null;
        state.submissionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_SUBMISSION][2], (state) => {
        state.submissionLoading = false;
      })

      // Submission review detail (GET /api/tests/submissions/{submissionId}/review)
      .addCase(ACTION_TYPES[ACTIONS.FETCH_SUBMISSION_REVIEW][0], (state) => {
        state.submissionReviewLoading = true;
        state.submissionReview = null;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_SUBMISSION_REVIEW][1], (state, { payload = {} }) => {
        const raw = payload.data?.data;
        const list = Array.isArray(raw) ? raw : (raw?.questions || []);
        state.submissionReview = list.map(normalizeSubmissionQuestion);
        state.submissionReviewLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_SUBMISSION_REVIEW][2], (state) => {
        state.submissionReviewLoading = false;
      })

      // Add question (admin) — POST /api/admin/tests/{testId}/questions. On
      // success the saved question is appended to adminTestQuestions so the
      // admin form's "next question number" stays in sync without a re-fetch.
      .addCase(ACTION_TYPES[ACTIONS.ADD_QUESTION][0], (state) => {
        state.addQuestionLoading = true;
        state.addQuestionError = '';
      })
      .addCase(ACTION_TYPES[ACTIONS.ADD_QUESTION][1], (state, { payload = {} }) => {
        const result = payload.data?.data || {};
        state.addQuestionResult = result;
        if (result.question) {
          state.adminTestQuestions.push(normalizeQuestion(result.question));
          state.adminTestQuestionsTotal += 1;
        }
        state.addQuestionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.ADD_QUESTION][2], (state, { payload = {} }) => {
        const errorData = payload.errorData || {};
        state.addQuestionError = errorData.message || errorData.errorMessage || 'Could not save this question. Please try again.';
        state.addQuestionLoading = false;
      })

      // Update question (admin) — PUT /api/admin/tests/{testId}/questions/{questionId}.
      // On success, replace the matching row in adminTestQuestions in place.
      .addCase(ACTION_TYPES[ACTIONS.UPDATE_QUESTION][0], (state) => {
        state.updateQuestionLoading = true;
        state.updateQuestionError = '';
      })
      .addCase(ACTION_TYPES[ACTIONS.UPDATE_QUESTION][1], (state, { payload = {} }) => {
        const result = payload.data?.data || {};
        state.updateQuestionResult = result;
        if (result.question) {
          const normalized = normalizeQuestion(result.question);
          const index = state.adminTestQuestions.findIndex((q) => String(q.id) === String(normalized.id));
          if (index >= 0) {
            state.adminTestQuestions[index] = normalized;
          }
        }
        state.updateQuestionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.UPDATE_QUESTION][2], (state, { payload = {} }) => {
        const errorData = payload.errorData || {};
        state.updateQuestionError = errorData.message || errorData.errorMessage || 'Could not save your changes. Please try again.';
        state.updateQuestionLoading = false;
      })

      // Bulk upload questions (admin) — POST /api/admin/tests/{testId}/questions/bulk.
      // Any successfully-created questions are appended to adminTestQuestions
      // alongside whatever row errors the backend reports.
      .addCase(ACTION_TYPES[ACTIONS.BULK_UPLOAD_QUESTIONS][0], (state) => {
        state.bulkUploadLoading = true;
        state.bulkUploadError = '';
        state.bulkUploadResult = null;
      })
      .addCase(ACTION_TYPES[ACTIONS.BULK_UPLOAD_QUESTIONS][1], (state, { payload = {} }) => {
        const result = payload.data?.data || {};
        state.bulkUploadResult = result;
        if (Array.isArray(result.questions)) {
          const normalized = result.questions.map(normalizeQuestion);
          state.adminTestQuestions.push(...normalized);
          state.adminTestQuestionsTotal += normalized.length;
        }
        state.bulkUploadLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.BULK_UPLOAD_QUESTIONS][2], (state, { payload = {} }) => {
        const errorData = payload.errorData || {};
        state.bulkUploadError = errorData.message || errorData.errorMessage || 'Bulk upload failed. Please check the file and try again.';
        state.bulkUploadLoading = false;
      })

      // Delete question (admin) — DELETE /api/tests/{testId}/questions/{questionId}.
      // Returns no body, so the list update happens via removeQuestion,
      // dispatched from the saga once this resolves.
      .addCase(ACTION_TYPES[ACTIONS.DELETE_QUESTION][0], (state) => {
        state.deleteQuestionLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.DELETE_QUESTION][1], (state) => {
        state.deleteQuestionLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.DELETE_QUESTION][2], (state) => {
        state.deleteQuestionLoading = false;
      })

      // Admin dashboard summary (GET /api/admin/dashboard/summary)
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_DASHBOARD_SUMMARY][0], (state) => {
        state.adminDashboardSummaryLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_DASHBOARD_SUMMARY][1], (state, { payload = {} }) => {
        state.adminDashboardSummary = payload.data?.data || null;
        state.adminDashboardSummaryLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_DASHBOARD_SUMMARY][2], (state) => {
        state.adminDashboardSummaryLoading = false;
      })

      // Download question template (GET /api/admin/tests/{testId}/questions/template).
      // Goes through the isDocument path in utils/http.js, so the success
      // payload is { data: { url, type, size, ext } } — a Blob object URL,
      // not the usual { data: { data: ... } } JSON envelope.
      .addCase(ACTION_TYPES[ACTIONS.DOWNLOAD_QUESTION_TEMPLATE][0], (state) => {
        state.questionTemplateLoading = true;
        state.questionTemplateFile = null;
      })
      .addCase(ACTION_TYPES[ACTIONS.DOWNLOAD_QUESTION_TEMPLATE][1], (state, { payload = {} }) => {
        state.questionTemplateFile = payload.data || null;
        state.questionTemplateLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.DOWNLOAD_QUESTION_TEMPLATE][2], (state) => {
        state.questionTemplateLoading = false;
      })

      // Admin test questions list (GET /api/admin/tests/{testId}/questions?search=).
      // Confirmed response: { data: { total, questions: [...] } } — rows are
      // normalized to the app's canonical question shape on the way in.
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_TEST_QUESTIONS][0], (state) => {
        state.adminTestQuestionsLoading = true;
        state.adminTestQuestions = [];
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_TEST_QUESTIONS][1], (state, { payload = {} }) => {
        const result = payload.data?.data || {};
        state.adminTestQuestions = (result.questions || []).map(normalizeQuestion);
        state.adminTestQuestionsTotal = result.total ?? state.adminTestQuestions.length;
        state.adminTestQuestionsLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_TEST_QUESTIONS][2], (state) => {
        state.adminTestQuestionsLoading = false;
      });
  }
});

export const { actions, reducer } = pagesSlice;

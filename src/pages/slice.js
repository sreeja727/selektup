import { createSlice } from '@reduxjs/toolkit';
import { _ } from '../common/lodash';
import { ACTION_TYPES, ACTIONS } from './actions';
import { ACCESS_STATUS, STATE_REDUCER_KEY } from './constants';
import {
  fromWireQuestion, getTypeConfig, QUESTION_KIND, OPTION_LETTERS,
} from './questionTypes';


const normalizeQuestion = fromWireQuestion;


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


function normalizeAdminResult(raw) {
  if (!raw) return raw;
  return {
    submissionId: raw.submissionId,
    studentName: raw.studentName,
    studentEmail: raw.studentEmail,
    categoryTitle: raw.categoryTitle,
    testTitle: raw.testTitle,
    submittedAt: raw.submittedAt,
    score: raw.score ?? 0,
    totalMarks: raw.totalMarks,
    totalQuestions: raw.totalQuestions,
    correct: raw.correctCount ?? 0,
    wrong: raw.wrongCount ?? 0,
    unanswered: raw.skippedCount ?? 0,
    correctMarks: raw.correctMarks ?? 0,
    negativeMarks: raw.negativeMarks ?? 0,
    hasPendingManualGrading: raw.hasPendingManualGrading ?? false,
    manualGradingCount: raw.manualGradingCount ?? 0,
  };
}

// GET /api/admin/tests responds with an untyped list (springdoc can't
// introspect the ad-hoc Map<String,Object> shape), so this reads several
// plausible field-name spellings defensively rather than assuming one —
// adjust here if the backend's actual keys turn out different.
function normalizeAdminTest(raw) {
  if (!raw) return raw;
  return {
    id: raw.id ?? raw.testId,
    title: raw.title ?? raw.testTitle ?? raw.name,
    categoryId: raw.categoryId ?? raw.category?.id ?? raw.testCategoryId,
    categoryTitle: raw.categoryTitle ?? raw.category?.title ?? raw.categoryName,
  };
}

// One row per student x purchased category (GET /api/admin/results/students).
function normalizeAdminStudentResult(raw) {
  if (!raw) return raw;
  return {
    studentId: raw.studentId,
    studentName: raw.studentName,
    studentEmail: raw.studentEmail,
    categoryId: raw.categoryId,
    categoryTitle: raw.categoryTitle ?? raw.categoryName,
    testsCompleted: raw.testsCompleted ?? raw.completedMockTests ?? 0,
    testsTotal: raw.testsTotal ?? raw.totalMockTests ?? 0,
    averageScorePercent: raw.averageScorePercent ?? (raw.averageScore != null ? Math.round(Number(raw.averageScore) * 100) : 0),
    lastAttemptAt: raw.lastAttemptAt ?? raw.lastAttemptDate ?? null,
  };
}

// A single mock test row within a student's category results (GET
// /api/admin/results/student/{studentId}/category/{categoryId}) — the
// backend returns a bare array of these (AdminStudentTestDto), with no
// student/category info attached, so that has to come from wherever the
// page was navigated from.
function normalizeAdminCategoryTest(raw) {
  if (!raw) return raw;
  return {
    testId: raw.testId,
    testTitle: raw.testTitle,
    status: raw.status || 'NOT_ATTEMPTED',
    attemptId: raw.attemptId ?? null,
    score: raw.score ?? null,
    totalMarks: raw.totalMarks ?? null,
    durationMinutes: raw.durationMinutes ?? null,
    submittedAt: raw.submittedAt ?? null,
  };
}

// Full per-question review for one attempt, admin-scoped (AdminAttemptReviewDto,
// shared by GET /api/admin/results/attempts/{attemptId}/review and GET
// /api/admin/results/review?studentId=&testId=) — reuses the same
// per-question normalization as the student-facing submission review.
function normalizeAdminAttemptReview(raw) {
  if (!raw) return raw;
  return {
    attemptId: raw.attemptId,
    studentName: raw.studentName,
    studentEmail: raw.studentEmail,
    categoryTitle: raw.categoryName,
    testTitle: raw.testTitle,
    submittedAt: raw.submittedAt,
    score: raw.score ?? 0,
    totalMarks: raw.totalMarks,
    totalQuestions: raw.totalQuestions,
    correct: raw.correctCount ?? 0,
    wrong: raw.wrongCount ?? 0,
    unanswered: raw.skippedCount ?? 0,
    accuracyPercent: raw.accuracy ?? 0,
    timeTakenSeconds: raw.timeTakenMinutes != null ? raw.timeTakenMinutes * 60 : null,
    hasPendingManualGrading: raw.hasPendingManualGrading ?? false,
    manualGradingCount: raw.manualGradingCount ?? 0,
    questions: (raw.questions || []).map(normalizeSubmissionQuestion),
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
  adminResults: [],
  adminResultsLoading: false,
  adminResultsTotalPages: 0,
  adminResultsPageSize: 10,
  adminResultsCurrentPage: 0,
  adminResultDetail: null,
  adminResultDetailLoading: false,
  adminTests: [],
  adminTestsLoading: false,
  adminStudentResults: [],
  adminStudentResultsLoading: false,
  adminStudentResultsTotalPages: 0,
  adminStudentResultsPageSize: 10,
  adminStudentResultsCurrentPage: 0,
  adminStudentCategoryResults: [],
  adminStudentCategoryResultsLoading: false,
  adminResultReview: null,
  adminResultReviewLoading: false,
  adminAttemptReviewByStudentTest: null,
  adminAttemptReviewByStudentTestLoading: false,
  adminEnquiries: [],
  adminEnquiriesLoading: false,
  contactSubmitting: false,
  contactSuccessMessage: '',
  contactError: '',

  testAttempt: null,

  testQuestions: [],
  testQuestionsLoading: false,
  submitTestLoading: false,
  submitTestResult: null,
  testAlreadyAttempted: false,
  testAlreadyAttemptedSubmissionId: null,

  startTestLoading: false,

  submission: null,
  submissionLoading: false,

  submissionReview: null,
  submissionReviewLoading: false,

  adminTestQuestions: [],
  adminTestQuestionsTotal: 0,
  adminTestQuestionsLoading: false,

  addQuestionLoading: false,
  addQuestionResult: null,
  addQuestionError: '',

  updateQuestionLoading: false,
  updateQuestionResult: null,
  updateQuestionError: '',

  bulkUploadLoading: false,
  bulkUploadResult: null,
  bulkUploadError: '',

  deleteQuestionLoading: false,

  deleteAllQuestionsLoading: false,

  adminDashboardSummary: null,
  adminDashboardSummaryLoading: false,

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
   
    clearAdminTestQuestions: (state) => {
      state.adminTestQuestions = [];
      state.adminTestQuestionsTotal = 0;
    }
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(
        ACTION_TYPES[ACTIONS.LOGIN][1],
        (state, { payload = {} }) => {
          _.set(state, 'loginData', payload.data || payload);
        }
      )

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
      .addCase(
        ACTION_TYPES[ACTIONS.CHANGE_PASSWORD][1],
        (state, { payload = {} }) => {
          _.set(state, 'changePasswordData', payload.data || payload);
        }
      )

      .addCase(ACTION_TYPES[ACTIONS.FETCH_ACCESS_STATUS][0], (state) => {
        state.statusLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ACCESS_STATUS][1], (state, { payload = {} }) => {
        const { payload: categorySlug, data: status } = payload;
        state.statusByCategory[categorySlug] = status;
        state.statusLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ACCESS_STATUS][2], (state, { payload = {} }) => {
        const { payload: categorySlug } = payload;
        if (categorySlug) {
          state.statusByCategory[categorySlug] = ACCESS_STATUS.NOT_REQUESTED;
        }
        state.statusLoading = false;
      })

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

      // Fetch admin results (GET /api/admin/results)
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULTS][0], (state) => {
        state.adminResultsLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULTS][1], (state, { payload = {} }) => {
        const raw = payload.data?.data;
        const src = Array.isArray(raw) ? { content: raw } : (raw || {});
        // The endpoint is typed as a generic Map (springdoc can't introspect
        // Page<T>), so this is a raw Spring Data Page: { content, totalPages,
        // size, number, ... }. Also accept pageSize/currentPage in case a
        // custom DTO is used instead — matches the defensive style already
        // used for FETCH_ADMIN_STUDENTS above.
        state.adminResults = (src.content || []).map(normalizeAdminResult);
        state.adminResultsTotalPages = src.totalPages ?? 0;
        state.adminResultsPageSize = src.pageSize ?? src.size ?? 10;
        state.adminResultsCurrentPage = src.currentPage ?? src.number ?? 0;
        state.adminResultsLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULTS][2], (state) => {
        state.adminResultsLoading = false;
      })

      // Fetch admin result detail (GET /api/admin/results/{submissionId})
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_DETAIL][0], (state) => {
        state.adminResultDetailLoading = true;
        state.adminResultDetail = null;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_DETAIL][1], (state, { payload = {} }) => {
        state.adminResultDetail = normalizeAdminResult(payload.data?.data) || null;
        state.adminResultDetailLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_DETAIL][2], (state) => {
        state.adminResultDetailLoading = false;
      })

      // Fetch admin tests (GET /api/admin/tests) — flat, admin-scoped list of
      // every mock test, used for the Results page's Mock Test filter.
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_TESTS][0], (state) => {
        state.adminTestsLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_TESTS][1], (state, { payload = {} }) => {
        const raw = payload.data?.data;
        const list = Array.isArray(raw) ? raw : (raw?.content || []);
        state.adminTests = list.map(normalizeAdminTest);
        state.adminTestsLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_TESTS][2], (state) => {
        state.adminTestsLoading = false;
      })

      // Fetch admin student results (GET /api/admin/results/students) — one
      // row per student x purchased category, backing the redesigned
      // Results list. Same Page<T>-as-Map response shape as
      // FETCH_ADMIN_RESULTS above.
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_RESULTS][0], (state) => {
        state.adminStudentResultsLoading = true;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_RESULTS][1], (state, { payload = {} }) => {
        const raw = payload.data?.data;
        const src = Array.isArray(raw) ? { content: raw } : (raw || {});
        state.adminStudentResults = (src.content || []).map(normalizeAdminStudentResult);
        state.adminStudentResultsTotalPages = src.totalPages ?? 0;
        state.adminStudentResultsPageSize = src.pageSize ?? src.size ?? 10;
        state.adminStudentResultsCurrentPage = src.currentPage ?? src.number ?? 0;
        state.adminStudentResultsLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_RESULTS][2], (state) => {
        state.adminStudentResultsLoading = false;
      })

      // Fetch a student's mock tests within one category (GET
      // /api/admin/results/student/{studentId}/category/{categoryId}) — backs
      // the Student Results Details page. Response is a bare array, so the
      // page has to source studentName/categoryTitle from wherever it navigated from.
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_CATEGORY_RESULTS][0], (state) => {
        state.adminStudentCategoryResultsLoading = true;
        state.adminStudentCategoryResults = [];
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_CATEGORY_RESULTS][1], (state, { payload = {} }) => {
        const raw = payload.data?.data;
        state.adminStudentCategoryResults = (Array.isArray(raw) ? raw : []).map(normalizeAdminCategoryTest);
        state.adminStudentCategoryResultsLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_CATEGORY_RESULTS][2], (state) => {
        state.adminStudentCategoryResultsLoading = false;
      })

      // Fetch the full per-question review for one attempt, admin-scoped
      // (GET /api/admin/results/attempts/{attemptId}/review).
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_REVIEW][0], (state) => {
        state.adminResultReviewLoading = true;
        state.adminResultReview = null;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_REVIEW][1], (state, { payload = {} }) => {
        state.adminResultReview = normalizeAdminAttemptReview(payload.data?.data) || null;
        state.adminResultReviewLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_REVIEW][2], (state) => {
        state.adminResultReviewLoading = false;
      })

      // Look up the same per-question review by studentId + testId instead of
      // attemptId (GET /api/admin/results/review?studentId=&testId=) — same
      // response shape (AdminAttemptReviewDto) as the attemptId-based fetch above.
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_ATTEMPT_REVIEW_BY_STUDENT_TEST][0], (state) => {
        state.adminAttemptReviewByStudentTestLoading = true;
        state.adminAttemptReviewByStudentTest = null;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_ATTEMPT_REVIEW_BY_STUDENT_TEST][1], (state, { payload = {} }) => {
        state.adminAttemptReviewByStudentTest = normalizeAdminAttemptReview(payload.data?.data) || null;
        state.adminAttemptReviewByStudentTestLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.FETCH_ADMIN_ATTEMPT_REVIEW_BY_STUDENT_TEST][2], (state) => {
        state.adminAttemptReviewByStudentTestLoading = false;
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
        state.testAlreadyAttempted = false;
        state.testAlreadyAttemptedSubmissionId = null;
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
      .addCase(ACTION_TYPES[ACTIONS.FETCH_TEST_QUESTIONS][2], (state, { payload = {} }) => {
        state.testQuestionsLoading = false;
        if (payload.httpStatus === 409) {
          state.testAlreadyAttempted = true;
          state.testAlreadyAttemptedSubmissionId = payload.errorData?.submissionId ?? state.testAlreadyAttemptedSubmissionId;
        }
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
      .addCase(ACTION_TYPES[ACTIONS.SUBMIT_TEST][2], (state, { payload = {} }) => {
        state.submitTestLoading = false;
        if (payload.httpStatus === 409) {
          state.testAlreadyAttempted = true;
          state.testAlreadyAttemptedSubmissionId = payload.errorData?.submissionId ?? state.testAlreadyAttemptedSubmissionId;
        }
      })

      // Start test attempt (POST /api/tests/{testId}/start) — fire-and-forget,
      // the UI doesn't block on it.
      .addCase(ACTION_TYPES[ACTIONS.START_TEST][0], (state) => {
        state.startTestLoading = true;
        // Instructions.jsx dispatches startTest without also dispatching
        // fetchTestQuestions, so it must clear these itself here — otherwise
        // a stale submissionId from a previously-viewed test leaks into the
        // next test's record (see recordTestAttempt call sites).
        state.testAlreadyAttempted = false;
        state.testAlreadyAttemptedSubmissionId = null;
      })
      .addCase(ACTION_TYPES[ACTIONS.START_TEST][1], (state) => {
        state.startTestLoading = false;
      })
      .addCase(ACTION_TYPES[ACTIONS.START_TEST][2], (state, { payload = {} }) => {
        state.startTestLoading = false;
        if (payload.httpStatus === 409) {
          state.testAlreadyAttempted = true;
          state.testAlreadyAttemptedSubmissionId = payload.errorData?.submissionId ?? state.testAlreadyAttemptedSubmissionId;
        }
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

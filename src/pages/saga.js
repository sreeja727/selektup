import { createAction } from '@reduxjs/toolkit';
import {
  all, takeLatest, put, fork, take, call, delay, select
} from 'redux-saga/effects';
import { _ } from '../common/lodash';
import { handleAPIRequest } from '../utils/http';
import { setAuthToken, setAuthUser } from '../utils/auth';
import { actions } from './slice';
import { ACTION_TYPES, ACTIONS } from './actions';
import * as api from './api';
import { toaster } from '../components/ui/toaster';
import { getAdminRequests } from './selectors';
import { ACCESS_STATUS } from './constants';

const ADMIN_ROLE = 'ADMIN';
const MOCK_LATENCY_MS = 300;

export function* registerSaga({ payload = {} }) {
  const { fullName = '', mobile = '', password = '' } = payload;
  yield put(actions.setApiLoading(true));
  yield fork(handleAPIRequest, api.registerApi, payload);
  const {
    payload: { data: resPayload = {} } = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.REGISTER_API][1],
    ACTION_TYPES[ACTIONS.REGISTER_API][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.REGISTER_API][1] && !_.isEmpty(resPayload)) {
    toaster.create({
      title: 'Registration',
      description: 'Registered successfully',
      type: 'success',
      duration: 4000,
      closable: true
    });
    yield put(
      actions.navigateTo({
        to: '/login',
        isSameModule: true,
        options: { state: { fullName, mobile, password } }
      })
    );
  } else if (type === ACTION_TYPES[ACTIONS.REGISTER_API][2]) {
    toaster.create({
      title: 'Registration',
      description: 'Registration failed. Please try again.',
      type: 'error',
      duration: 4000,
      closable: true
    });
  }
  yield put(actions.setApiLoading(false));
}


export function* loginSaga({ payload = {} }) {
  const { redirect, ...credentials } = payload;
  yield put(actions.setApiLoading(true));
  yield fork(handleAPIRequest, api.loginApi, credentials);
  const {
    payload: apiPayload = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.LOGIN][1],
    ACTION_TYPES[ACTIONS.LOGIN][2]
  ]);

  if (type === ACTION_TYPES[ACTIONS.LOGIN][1]) {
    const response = apiPayload.data || {};
    const { success, message = '', data: userData = {} } = response;

    if (success && !_.isEmpty(userData)) {
      const {
        token, userId, fullName, mobile, role
      } = userData;
      setAuthToken(token);
      setAuthUser({
        userId, fullName, mobile, role
      });

      toaster.create({
        title: 'Login',
        description: 'Login successfully',
        type: 'success',
        duration: 4000,
        closable: true
      });
      yield put(
        actions.navigateTo({
          to: role === ADMIN_ROLE ? '/admin/dashboard' : (redirect || '/test-series'),
          options: { replace: true }
        })
      );
    } else {
      toaster.create({
        title: 'Login Failed',
        description: message || 'Invalid email/mobile or password.',
        type: 'error',
        duration: 4000,
        closable: true
      });
    }
  }
  yield put(actions.setApiLoading(false));
}



export function* forgotPasswordSaga({ payload = {} }) {
  yield put(actions.setApiLoading(true));
  yield fork(handleAPIRequest, api.forgotPasswordApi, payload);
  const {
    payload: apiPayload = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.FORGOT_PASSWORD][1],
    ACTION_TYPES[ACTIONS.FORGOT_PASSWORD][2]
  ]);

  if (type === ACTION_TYPES[ACTIONS.FORGOT_PASSWORD][1]) {
    const { success, message = '' } = apiPayload.data || {};
    if (success) {
      toaster.create({
        title: 'OTP sent',
        description: 'Check the email linked to your account for a one-time password.',
        type: 'success',
        duration: 4000,
        closable: true
      });
    } else {
      toaster.create({
        title: 'Request failed',
        description: message || 'No account found for that mobile number.',
        type: 'error',
        duration: 4000,
        closable: true
      });
    }
  } else {
    toaster.create({
      title: 'Request failed',
      description: 'Unable to reach the server right now. Please try again.',
      type: 'error',
      duration: 4000,
      closable: true
    });
  }
  yield put(actions.setApiLoading(false));
}

export function* verifyOtpSaga({ payload = {} }) {
  const { mobile } = payload;
  yield put(actions.setApiLoading(true));
  yield fork(handleAPIRequest, api.verifyOtpApi, payload);
  const {
    payload: apiPayload = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.VERIFY_OTP][1],
    ACTION_TYPES[ACTIONS.VERIFY_OTP][2]
  ]);

  if (type === ACTION_TYPES[ACTIONS.VERIFY_OTP][1]) {
    const { success, message = '', data: resultData = {} } = apiPayload.data || {};
    if (success) {
      
      const resetToken = resultData.resetToken || resultData.token || '';
      yield put(actions.navigateTo({ to: '/reset-password', options: { state: { mobile, resetToken } } }));
    } else {
      toaster.create({
        title: 'Invalid OTP',
        description: message || 'That code is incorrect or has expired. Please try again.',
        type: 'error',
        duration: 4000,
        closable: true
      });
    }
  } else {
    toaster.create({
      title: 'Verification failed',
      description: 'Unable to reach the server right now. Please try again.',
      type: 'error',
      duration: 4000,
      closable: true
    });
  }
  yield put(actions.setApiLoading(false));
}

export function* resetPasswordSaga({ payload = {} }) {
  yield put(actions.setApiLoading(true));
  yield fork(handleAPIRequest, api.resetPasswordApi, payload);
  const {
    payload: apiPayload = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.RESET_PASSWORD][1],
    ACTION_TYPES[ACTIONS.RESET_PASSWORD][2]
  ]);

  if (type === ACTION_TYPES[ACTIONS.RESET_PASSWORD][1]) {
    const { success, message = '' } = apiPayload.data || {};
    if (success) {
      toaster.create({
        title: 'Password reset successfully.',
        description: 'Please log in with your new password.',
        type: 'success',
        duration: 4000,
        closable: true
      });
      yield put(actions.navigateTo({ to: '/login', isSameModule: true }));
    } else {
      toaster.create({
        title: 'Reset failed',
        description: message || 'This OTP is invalid or has expired.',
        type: 'error',
        duration: 4000,
        closable: true
      });
    }
  } else {
    toaster.create({
      title: 'Reset failed',
      description: 'Unable to reach the server right now. Please try again.',
      type: 'error',
      duration: 4000,
      closable: true
    });
  }
  yield put(actions.setApiLoading(false));
}

export function* changePasswordSaga({ payload = {} }) {
  yield put(actions.setApiLoading(true));
  yield fork(handleAPIRequest, api.changePasswordApi, payload);
  const {
    payload: apiPayload = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.CHANGE_PASSWORD][1],
    ACTION_TYPES[ACTIONS.CHANGE_PASSWORD][2]
  ]);

  if (type === ACTION_TYPES[ACTIONS.CHANGE_PASSWORD][1]) {
    const { success, message = '' } = apiPayload.data || {};
    if (success) {
      toaster.create({
        title: 'Password changed',
        description: message || 'Your password has been updated.',
        type: 'success',
        duration: 4000,
        closable: true
      });
    } else {
      toaster.create({
        title: 'Could not change password',
        description: message || 'Please check your current password and try again.',
        type: 'error',
        duration: 4000,
        closable: true
      });
    }
  } else {
    toaster.create({
      title: 'Could not change password',
      description: 'Unable to reach the server right now. Please try again.',
      type: 'error',
      duration: 4000,
      closable: true
    });
  }
  yield put(actions.setApiLoading(false));
}

function* runRequest(actionKey, worker, payload) {
  const [REQUEST, SUCCESS, FAILURE] = ACTION_TYPES[actionKey];
  yield put(createAction(REQUEST)());
  try {
    yield delay(MOCK_LATENCY_MS);
    const data = yield call(worker, payload);
    yield put(createAction(SUCCESS)({ payload, data }));
    return data;
  } catch (error) {
    yield put(createAction(FAILURE)({ payload, error: error.message }));
    toaster.create({
      title: 'Something went wrong',
      description: error.message || 'Please try again.',
      type: 'error',
      duration: 4000,
      closable: true
    });
    return undefined;
  }
}

function* fetchAccessStatusSaga({ payload: categorySlug }) {
  yield call(runRequest, ACTIONS.FETCH_ACCESS_STATUS, api.getAccessStatus, categorySlug);
}

function* requestAccessSaga({ payload }) {
  const status = yield call(runRequest, ACTIONS.REQUEST_ACCESS, api.submitAccessRequest, payload);
  if (status) {
    toaster.create({
      title: 'Request Submitted Successfully',
      description: 'Our admin will verify your payment and approve access.',
      type: 'success',
      duration: 4500,
      closable: true
    });
  }
}

function* fetchAdminRequestsSaga() {
  yield fork(handleAPIRequest, api.getAdminCategoryAccessApi);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_REQUESTS][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_REQUESTS][2]
  ]);
}

function* approveRequestSaga({ payload: requestId }) {
  const requests = yield select(getAdminRequests);
  const target = requests.find((r) => r.requestId === requestId);

  yield fork(handleAPIRequest, api.approveCategoryAccessApi, requestId);
  const { type } = yield take([
    ACTION_TYPES[ACTIONS.APPROVE_REQUEST][1],
    ACTION_TYPES[ACTIONS.APPROVE_REQUEST][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.APPROVE_REQUEST][1]) {
    yield put(actions.setAdminRequestStatus({ requestId, status: ACCESS_STATUS.APPROVED }));
    toaster.create({
      title: 'Access approved',
      description: target ? `${target.studentName} now has access to ${target.categoryTitle}.` : 'Request approved.',
      type: 'success',
      duration: 4000,
      closable: true
    });
  }
}

function* rejectRequestSaga({ payload: requestId }) {
  const requests = yield select(getAdminRequests);
  const target = requests.find((r) => r.requestId === requestId);

  yield fork(handleAPIRequest, api.rejectCategoryAccessApi, requestId);
  const { type } = yield take([
    ACTION_TYPES[ACTIONS.REJECT_REQUEST][1],
    ACTION_TYPES[ACTIONS.REJECT_REQUEST][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.REJECT_REQUEST][1]) {
    yield put(actions.setAdminRequestStatus({ requestId, status: ACCESS_STATUS.REJECTED }));
    toaster.create({
      title: 'Access rejected',
      description: target ? `${target.studentName}'s request for ${target.categoryTitle} was rejected.` : 'Request rejected.',
      type: 'info',
      duration: 4000,
      closable: true
    });
  }
}

function* fetchTestCategoriesSaga() {
  yield fork(handleAPIRequest, api.getTestCategoriesApi);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORIES][1],
    ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORIES][2]
  ]);
}

function* fetchAdminStudentsSaga({ payload }) {
  yield fork(handleAPIRequest, api.getAdminStudentsApi, payload);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENTS][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENTS][2]
  ]);
}

function* fetchAdminResultsSaga({ payload }) {
  yield fork(handleAPIRequest, api.getAdminResultsApi, payload);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULTS][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULTS][2]
  ]);
}

function* fetchAdminResultDetailSaga({ payload: submissionId }) {
  yield fork(handleAPIRequest, api.getAdminResultDetailApi, submissionId);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_DETAIL][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_DETAIL][2]
  ]);
}

function* fetchAdminTestsSaga() {
  yield fork(handleAPIRequest, api.getAdminTestsApi);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_TESTS][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_TESTS][2]
  ]);
}

function* fetchAdminStudentResultsSaga({ payload }) {
  yield fork(handleAPIRequest, api.getAdminStudentResultsApi, payload);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_RESULTS][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_RESULTS][2]
  ]);
}

function* fetchAdminStudentCategoryResultsSaga({ payload }) {
  yield fork(handleAPIRequest, api.getAdminStudentCategoryResultsApi, payload);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_CATEGORY_RESULTS][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_STUDENT_CATEGORY_RESULTS][2]
  ]);
}

function* fetchAdminResultReviewSaga({ payload: attemptId }) {
  yield fork(handleAPIRequest, api.getAdminResultReviewApi, attemptId);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_REVIEW][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_RESULT_REVIEW][2]
  ]);
}

function* fetchAdminAttemptReviewByStudentTestSaga({ payload }) {
  yield fork(handleAPIRequest, api.getAdminAttemptReviewByStudentTestApi, payload);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_ATTEMPT_REVIEW_BY_STUDENT_TEST][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_ATTEMPT_REVIEW_BY_STUDENT_TEST][2]
  ]);
}

function* fetchTestCategoryDetailSaga({ payload: categoryId }) {
  yield fork(handleAPIRequest, api.getTestCategoryDetailApi, categoryId);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORY_DETAIL][1],
    ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORY_DETAIL][2]
  ]);
}

function* fetchTestDetailSaga({ payload }) {
  yield fork(handleAPIRequest, api.getTestDetailApi, payload);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_TEST_DETAIL][1],
    ACTION_TYPES[ACTIONS.FETCH_TEST_DETAIL][2]
  ]);
}

function* requestCategoryAccessSaga({ payload: categoryId }) {
  yield fork(handleAPIRequest, api.requestCategoryAccessApi, categoryId);
  const { type } = yield take([
    ACTION_TYPES[ACTIONS.REQUEST_CATEGORY_ACCESS][1],
    ACTION_TYPES[ACTIONS.REQUEST_CATEGORY_ACCESS][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.REQUEST_CATEGORY_ACCESS][1]) {
    toaster.create({
      title: 'Request Submitted Successfully',
      description: 'Our admin will verify your payment and approve access.',
      type: 'success',
      duration: 4500,
      closable: true
    });
  }
}

function* blockStudentSaga({ payload: studentId }) {
  yield fork(handleAPIRequest, api.blockStudentApi, studentId);
  const { type } = yield take([
    ACTION_TYPES[ACTIONS.BLOCK_STUDENT][1],
    ACTION_TYPES[ACTIONS.BLOCK_STUDENT][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.BLOCK_STUDENT][1]) {
    yield put(actions.setStudentBlocked({ id: studentId, blocked: true }));
    toaster.create({
      title: 'Student blocked',
      description: 'The student can no longer log in.',
      type: 'info',
      duration: 3500,
      closable: true
    });
  }
}

function* unblockStudentSaga({ payload: studentId }) {
  yield fork(handleAPIRequest, api.unblockStudentApi, studentId);
  const { type } = yield take([
    ACTION_TYPES[ACTIONS.UNBLOCK_STUDENT][1],
    ACTION_TYPES[ACTIONS.UNBLOCK_STUDENT][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.UNBLOCK_STUDENT][1]) {
    yield put(actions.setStudentBlocked({ id: studentId, blocked: false }));
    toaster.create({
      title: 'Student unblocked',
      description: 'The student can log in again.',
      type: 'success',
      duration: 3500,
      closable: true
    });
  }
}

function* fetchAdminEnquiriesSaga() {
  yield fork(handleAPIRequest, api.getAdminEnquiriesApi);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_ENQUIRIES][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_ENQUIRIES][2]
  ]);
}

function* fetchAdminDashboardSummarySaga() {
  yield fork(handleAPIRequest, api.getAdminDashboardSummaryApi);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_DASHBOARD_SUMMARY][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_DASHBOARD_SUMMARY][2]
  ]);
}

function* downloadQuestionTemplateSaga({ payload: testId }) {
  yield fork(handleAPIRequest, api.downloadQuestionTemplateApi, testId);
  const {
    payload: apiPayload = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.DOWNLOAD_QUESTION_TEMPLATE][1],
    ACTION_TYPES[ACTIONS.DOWNLOAD_QUESTION_TEMPLATE][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.DOWNLOAD_QUESTION_TEMPLATE][1]) {
    const { url, ext = 'xlsx' } = apiPayload.data || {};
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `question-upload-template.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } else {
    toaster.create({
      title: 'Download failed',
      description: 'Could not download the question template. Please try again.',
      type: 'error',
      duration: 4000,
      closable: true
    });
  }
}

function* submitContactSaga({ payload }) {
  yield fork(handleAPIRequest, api.submitContactApi, payload);
  yield take([
    ACTION_TYPES[ACTIONS.SUBMIT_CONTACT][1],
    ACTION_TYPES[ACTIONS.SUBMIT_CONTACT][2]
  ]);
}

function* fetchTestQuestionsSaga({ payload: testId }) {
  yield fork(handleAPIRequest, api.getTestQuestionsApi, testId);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_TEST_QUESTIONS][1],
    ACTION_TYPES[ACTIONS.FETCH_TEST_QUESTIONS][2]
  ]);
}

function* fetchAdminTestQuestionsSaga({ payload }) {
  yield fork(handleAPIRequest, api.getAdminTestQuestionsApi, payload);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_TEST_QUESTIONS][1],
    ACTION_TYPES[ACTIONS.FETCH_ADMIN_TEST_QUESTIONS][2]
  ]);
}

function* submitTestSaga({ payload }) {
  yield fork(handleAPIRequest, api.submitTestApi, payload);
  yield take([
    ACTION_TYPES[ACTIONS.SUBMIT_TEST][1],
    ACTION_TYPES[ACTIONS.SUBMIT_TEST][2]
  ]);
}

function* startTestSaga({ payload: testId }) {
  yield fork(handleAPIRequest, api.startTestApi, testId);
  yield take([
    ACTION_TYPES[ACTIONS.START_TEST][1],
    ACTION_TYPES[ACTIONS.START_TEST][2]
  ]);
}

function* fetchSubmissionSaga({ payload: submissionId }) {
  yield fork(handleAPIRequest, api.getSubmissionApi, submissionId);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_SUBMISSION][1],
    ACTION_TYPES[ACTIONS.FETCH_SUBMISSION][2]
  ]);
}

function* fetchSubmissionReviewSaga({ payload: submissionId }) {
  yield fork(handleAPIRequest, api.getSubmissionReviewApi, submissionId);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_SUBMISSION_REVIEW][1],
    ACTION_TYPES[ACTIONS.FETCH_SUBMISSION_REVIEW][2]
  ]);
}

function* addQuestionSaga({ payload }) {
  yield fork(handleAPIRequest, api.addQuestionApi, payload);
  const { type } = yield take([
    ACTION_TYPES[ACTIONS.ADD_QUESTION][1],
    ACTION_TYPES[ACTIONS.ADD_QUESTION][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.ADD_QUESTION][1]) {
    toaster.create({
      title: 'Question saved',
      description: 'Ready for the next question.',
      type: 'success',
      duration: 2500,
      closable: true
    });
  }
}

function* updateQuestionSaga({ payload }) {
  yield fork(handleAPIRequest, api.updateQuestionApi, payload);
  const { type } = yield take([
    ACTION_TYPES[ACTIONS.UPDATE_QUESTION][1],
    ACTION_TYPES[ACTIONS.UPDATE_QUESTION][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.UPDATE_QUESTION][1]) {
    toaster.create({
      title: 'Question updated',
      description: 'Your changes have been saved.',
      type: 'success',
      duration: 3500,
      closable: true
    });
  }
}

function* bulkUploadQuestionsSaga({ payload }) {
  yield fork(handleAPIRequest, api.bulkUploadQuestionsApi, payload);
  const {
    payload: apiPayload = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.BULK_UPLOAD_QUESTIONS][1],
    ACTION_TYPES[ACTIONS.BULK_UPLOAD_QUESTIONS][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.BULK_UPLOAD_QUESTIONS][1]) {
    const result = apiPayload.data?.data || {};
    const added = Array.isArray(result.questions) ? result.questions.length : (result.addedCount ?? 0);
    const errorCount = result.errors?.length || 0;
    toaster.create({
      title: 'Bulk upload complete',
      description: `${added} question(s) added.${errorCount ? ` ${errorCount} row(s) had errors.` : ''}`,
      type: errorCount ? 'warning' : 'success',
      duration: 5000,
      closable: true
    });
  }
}

function* deleteQuestionSaga({ payload }) {
  const { questionId } = payload;
  yield fork(handleAPIRequest, api.deleteQuestionApi, payload);
  const { type } = yield take([
    ACTION_TYPES[ACTIONS.DELETE_QUESTION][1],
    ACTION_TYPES[ACTIONS.DELETE_QUESTION][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.DELETE_QUESTION][1]) {
    yield put(actions.removeQuestion({ questionId }));
    toaster.create({
      title: 'Question deleted',
      type: 'success',
      duration: 3000,
      closable: true
    });
  }
}

function* deleteAllQuestionsSaga({ payload = {} }) {
  const { testId, questionIds = [], isFiltered } = payload;

  if (!isFiltered) {
    yield put(actions.setDeleteAllQuestionsLoading(true));
    yield fork(handleAPIRequest, api.deleteAllQuestionsApi, testId);
    const { type } = yield take([
      ACTION_TYPES[ACTIONS.DELETE_ALL_QUESTIONS][1],
      ACTION_TYPES[ACTIONS.DELETE_ALL_QUESTIONS][2]
    ]);
    yield put(actions.setDeleteAllQuestionsLoading(false));
    if (type === ACTION_TYPES[ACTIONS.DELETE_ALL_QUESTIONS][1]) {
      yield put(actions.clearAdminTestQuestions());
      toaster.create({
        title: 'All questions deleted',
        type: 'success',
        duration: 4000,
        closable: true
      });
    } else {
      toaster.create({
        title: 'Could not delete questions',
        description: 'Please try again.',
        type: 'error',
        duration: 4000,
        closable: true
      });
    }
    return;
  }

  if (questionIds.length === 0) return;

  yield put(actions.setDeleteAllQuestionsLoading(true));
  let successCount = 0;
  let failCount = 0;
  for (const questionId of questionIds) {
    const { error } = (yield call(handleAPIRequest, api.deleteQuestionApi, { testId, questionId })) || {};
    if (_.isEmpty(error)) {
      successCount += 1;
      yield put(actions.removeQuestion({ questionId }));
    } else {
      failCount += 1;
    }
  }
  yield put(actions.setDeleteAllQuestionsLoading(false));

  if (failCount === 0) {
    toaster.create({
      title: 'All questions deleted',
      description: `${successCount} question(s) removed.`,
      type: 'success',
      duration: 4000,
      closable: true
    });
  } else {
    toaster.create({
      title: 'Some questions could not be deleted',
      description: `${successCount} removed, ${failCount} failed. Try again for the remaining ones.`,
      type: 'warning',
      duration: 5000,
      closable: true
    });
  }
}

export default function* pagesSaga() {
  yield all([
    takeLatest(ACTIONS.REGISTER, registerSaga),
    takeLatest(ACTIONS.LOGIN, loginSaga),
    takeLatest(ACTIONS.FORGOT_PASSWORD, forgotPasswordSaga),
    takeLatest(ACTIONS.VERIFY_OTP, verifyOtpSaga),
    takeLatest(ACTIONS.RESET_PASSWORD, resetPasswordSaga),
    takeLatest(ACTIONS.CHANGE_PASSWORD, changePasswordSaga),

    takeLatest(ACTIONS.FETCH_ACCESS_STATUS, fetchAccessStatusSaga),
    takeLatest(ACTIONS.REQUEST_ACCESS, requestAccessSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_REQUESTS, fetchAdminRequestsSaga),
    takeLatest(ACTIONS.APPROVE_REQUEST, approveRequestSaga),
    takeLatest(ACTIONS.REJECT_REQUEST, rejectRequestSaga),
    takeLatest(ACTIONS.FETCH_TEST_CATEGORIES, fetchTestCategoriesSaga),
    takeLatest(ACTIONS.FETCH_TEST_CATEGORY_DETAIL, fetchTestCategoryDetailSaga),
    takeLatest(ACTIONS.FETCH_TEST_DETAIL, fetchTestDetailSaga),
    takeLatest(ACTIONS.REQUEST_CATEGORY_ACCESS, requestCategoryAccessSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_STUDENTS, fetchAdminStudentsSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_RESULTS, fetchAdminResultsSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_RESULT_DETAIL, fetchAdminResultDetailSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_TESTS, fetchAdminTestsSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_STUDENT_RESULTS, fetchAdminStudentResultsSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_STUDENT_CATEGORY_RESULTS, fetchAdminStudentCategoryResultsSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_RESULT_REVIEW, fetchAdminResultReviewSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_ATTEMPT_REVIEW_BY_STUDENT_TEST, fetchAdminAttemptReviewByStudentTestSaga),
    takeLatest(ACTIONS.BLOCK_STUDENT, blockStudentSaga),
    takeLatest(ACTIONS.UNBLOCK_STUDENT, unblockStudentSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_ENQUIRIES, fetchAdminEnquiriesSaga),
    takeLatest(ACTIONS.SUBMIT_CONTACT, submitContactSaga),
    takeLatest(ACTIONS.FETCH_TEST_QUESTIONS, fetchTestQuestionsSaga),
    takeLatest(ACTIONS.SUBMIT_TEST, submitTestSaga),
    takeLatest(ACTIONS.START_TEST, startTestSaga),
    takeLatest(ACTIONS.FETCH_SUBMISSION, fetchSubmissionSaga),
    takeLatest(ACTIONS.FETCH_SUBMISSION_REVIEW, fetchSubmissionReviewSaga),
    takeLatest(ACTIONS.ADD_QUESTION, addQuestionSaga),
    takeLatest(ACTIONS.UPDATE_QUESTION, updateQuestionSaga),
    takeLatest(ACTIONS.BULK_UPLOAD_QUESTIONS, bulkUploadQuestionsSaga),
    takeLatest(ACTIONS.DELETE_QUESTION, deleteQuestionSaga),
    takeLatest(ACTIONS.DELETE_ALL_QUESTIONS, deleteAllQuestionsSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_DASHBOARD_SUMMARY, fetchAdminDashboardSummarySaga),
    takeLatest(ACTIONS.DOWNLOAD_QUESTION_TEMPLATE, downloadQuestionTemplateSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_TEST_QUESTIONS, fetchAdminTestQuestionsSaga)
  ]);
}

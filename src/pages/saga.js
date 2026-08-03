import { createAction } from '@reduxjs/toolkit';
import {
  all, takeLatest, put, fork, take, call, delay
} from 'redux-saga/effects';
import { _ } from '../common/lodash';
import { handleAPIRequest } from '../utils/http';
import { setAuthToken, setAuthUser } from '../utils/auth';
import { actions } from './slice';
import { ACTION_TYPES, ACTIONS } from './actions';
import * as api from './api';
import { toaster } from '../components/ui/toaster';

const ADMIN_ROLE = 'ADMIN';
const MOCK_LATENCY_MS = 300;

/* ===========================
   AUTH SAGAS
=========================== */

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
  const { mobile, otp } = payload;
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
    const { success, message = '' } = apiPayload.data || {};
    if (success) {
      yield put(actions.navigateTo({ to: '/reset-password', options: { state: { mobile, otp } } }));
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

/* ===========================
   CATEGORY ACCESS SAGAS
=========================== */

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
  yield fork(handleAPIRequest, api.approveCategoryAccessApi, requestId);
  const {
    payload: apiPayload = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.APPROVE_REQUEST][1],
    ACTION_TYPES[ACTIONS.APPROVE_REQUEST][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.APPROVE_REQUEST][1]) {
    const record = apiPayload.data?.data;
    toaster.create({
      title: 'Access approved',
      description: record ? `${record.studentName} now has access to ${record.categoryTitle}.` : 'Request approved.',
      type: 'success',
      duration: 4000,
      closable: true
    });
  }
}

function* rejectRequestSaga({ payload: requestId }) {
  yield fork(handleAPIRequest, api.rejectCategoryAccessApi, requestId);
  const {
    payload: apiPayload = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.REJECT_REQUEST][1],
    ACTION_TYPES[ACTIONS.REJECT_REQUEST][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.REJECT_REQUEST][1]) {
    const record = apiPayload.data?.data;
    toaster.create({
      title: 'Access rejected',
      description: record ? `${record.studentName}'s request for ${record.categoryTitle} was rejected.` : 'Request rejected.',
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

function* fetchTestCategoryDetailSaga({ payload: categoryId }) {
  yield fork(handleAPIRequest, api.getTestCategoryDetailApi, categoryId);
  yield take([
    ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORY_DETAIL][1],
    ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORY_DETAIL][2]
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

export default function* pagesSaga() {
  yield all([
    takeLatest(ACTIONS.REGISTER, registerSaga),
    takeLatest(ACTIONS.LOGIN, loginSaga),
    takeLatest(ACTIONS.FORGOT_PASSWORD, forgotPasswordSaga),
    takeLatest(ACTIONS.VERIFY_OTP, verifyOtpSaga),
    takeLatest(ACTIONS.RESET_PASSWORD, resetPasswordSaga),

    takeLatest(ACTIONS.FETCH_ACCESS_STATUS, fetchAccessStatusSaga),
    takeLatest(ACTIONS.REQUEST_ACCESS, requestAccessSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_REQUESTS, fetchAdminRequestsSaga),
    takeLatest(ACTIONS.APPROVE_REQUEST, approveRequestSaga),
    takeLatest(ACTIONS.REJECT_REQUEST, rejectRequestSaga),
    takeLatest(ACTIONS.FETCH_TEST_CATEGORIES, fetchTestCategoriesSaga),
    takeLatest(ACTIONS.FETCH_TEST_CATEGORY_DETAIL, fetchTestCategoryDetailSaga),
    takeLatest(ACTIONS.REQUEST_CATEGORY_ACCESS, requestCategoryAccessSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_STUDENTS, fetchAdminStudentsSaga),
    takeLatest(ACTIONS.BLOCK_STUDENT, blockStudentSaga),
    takeLatest(ACTIONS.UNBLOCK_STUDENT, unblockStudentSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_ENQUIRIES, fetchAdminEnquiriesSaga)
  ]);
}

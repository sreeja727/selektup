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
    payload: { data: resPayload = {}, errorMessage = '' } = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.REGISTER_API][1],
    ACTION_TYPES[ACTIONS.REGISTER_API][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.REGISTER_API][1] && !_.isEmpty(resPayload) && errorMessage === null) {
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
  yield put(actions.setApiLoading(true));
  yield fork(handleAPIRequest, api.loginApi, payload);
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
        token, userId, fullName, emailOrMobile, role
      } = userData;
      setAuthToken(token);
      setAuthUser({
        userId, fullName, emailOrMobile, role
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
          to: role === ADMIN_ROLE ? '/admin/dashboard' : '/test-series',
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
        title: 'Reset link sent',
        description: 'Check the email linked to your account for a password reset link.',
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
        description: message || 'This reset link is invalid or has expired.',
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
  yield call(runRequest, ACTIONS.FETCH_ADMIN_REQUESTS, api.getAllRequests);
}

function* approveRequestSaga({ payload: requestId }) {
  const record = yield call(runRequest, ACTIONS.APPROVE_REQUEST, () => api.setRequestStatus(requestId, 'APPROVED'));
  if (record) {
    toaster.create({
      title: 'Access approved',
      description: `${record.studentName} now has access to ${record.categoryTitle}.`,
      type: 'success',
      duration: 4000,
      closable: true
    });
  }
}

function* rejectRequestSaga({ payload: requestId }) {
  const record = yield call(runRequest, ACTIONS.REJECT_REQUEST, () => api.setRequestStatus(requestId, 'REJECTED'));
  if (record) {
    toaster.create({
      title: 'Access rejected',
      description: `${record.studentName}'s request for ${record.categoryTitle} was rejected.`,
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

export default function* pagesSaga() {
  yield all([
    takeLatest(ACTIONS.REGISTER, registerSaga),
    takeLatest(ACTIONS.LOGIN, loginSaga),
    takeLatest(ACTIONS.FORGOT_PASSWORD, forgotPasswordSaga),
    takeLatest(ACTIONS.RESET_PASSWORD, resetPasswordSaga),

    takeLatest(ACTIONS.FETCH_ACCESS_STATUS, fetchAccessStatusSaga),
    takeLatest(ACTIONS.REQUEST_ACCESS, requestAccessSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_REQUESTS, fetchAdminRequestsSaga),
    takeLatest(ACTIONS.APPROVE_REQUEST, approveRequestSaga),
    takeLatest(ACTIONS.REJECT_REQUEST, rejectRequestSaga),
    takeLatest(ACTIONS.FETCH_TEST_CATEGORIES, fetchTestCategoriesSaga)
  ]);
}

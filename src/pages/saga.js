import {
  all, takeLatest,  put, fork, take
} from 'redux-saga/effects';
import { _ } from '../common/lodash';
import { handleAPIRequest } from '../utils/http';
import { setAuthToken, setAuthUser } from '../utils/auth';
import { actions as commonActions } from './common/slice';
import { ACTION_TYPES, ACTIONS } from './actions';
import * as api from './api';
import { toaster } from '../components/ui/toaster';

const ADMIN_ROLE = 'ADMIN';

export function* registerSaga({ payload = {} }) {
  const { fullName = '', mobile = '', password = '' } = payload;
  yield put(commonActions.setApiLoading(true));
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
      commonActions.navigateTo({
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
  yield put(commonActions.setApiLoading(false));
}


export function* loginSaga({ payload = {} }) {
  yield put(commonActions.setApiLoading(true));
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
        commonActions.navigateTo({
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
  yield put(commonActions.setApiLoading(false));
}



export function* forgotPasswordSaga({ payload = {} }) {
  yield put(commonActions.setApiLoading(true));
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
  yield put(commonActions.setApiLoading(false));
}

export function* resetPasswordSaga({ payload = {} }) {
  yield put(commonActions.setApiLoading(true));
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
        title: 'Password reset',
        description: 'Your password has been reset. Please log in with your new password.',
        type: 'success',
        duration: 4000,
        closable: true
      });
      yield put(commonActions.navigateTo({ to: '/login', isSameModule: true }));
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
  yield put(commonActions.setApiLoading(false));
}

export default function* partnerOnboardedRequestSaga() {
  yield all([

    takeLatest(ACTIONS.REGISTER, registerSaga),
    takeLatest(ACTIONS.LOGIN,loginSaga),
    takeLatest(ACTIONS.FORGOT_PASSWORD, forgotPasswordSaga),
    takeLatest(ACTIONS.RESET_PASSWORD, resetPasswordSaga)
  ]);
}

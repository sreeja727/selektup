import {
  all, takeLatest,  put, fork, take
} from 'redux-saga/effects';
import { _ } from '../common/lodash';
import { handleAPIRequest } from '../utils/http';
import { setAuthToken, setAuthUser } from '../utils/auth';
import { actions as commonActions } from './common/slice';
import { ACTION_TYPES, ACTIONS } from './actions';
import * as api from './api';

const ADMIN_ROLE = 'ADMIN';

export function* registerSaga({ payload = {} }) {
  const { fullName = '', emailOrMobile = '', password = '' } = payload;
  yield put(commonActions.setApiLoading(true));
  yield fork(handleAPIRequest, api.registerApi, payload);
  const {
    payload: { data: resPayload = {}, errorMessage = '' } = {},
    type = ''
  } = yield take([
    ACTION_TYPES[ACTIONS.REGISTER_API][1],
    ACTION_TYPES[ACTIONS.REGISTER_API][2]
  ]);
  if (type === ACTION_TYPES[ACTIONS.REGISTER_API][1] && !_.isEmpty(resPayload)) {
    if (errorMessage === null) {
      yield put(
        commonActions.setCustomToast({
          open: true,
          variant: 'success',
          message: 'Registered successfully',
          title: 'Registration'
        })
      );
      yield put(
        commonActions.navigateTo({
          to: '/login',
          isSameModule: true,
          options: { state: { fullName, emailOrMobile, password } }
        })
      );
    }
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

      yield put(
        commonActions.setCustomToast({
          open: true,
          variant: 'success',
          message: 'Login successfully',
          title: 'Login'
        })
      );
      yield put(
        commonActions.navigateTo({
          to: role === ADMIN_ROLE ? '/admin/dashboard' : '/test-series',
          options: { replace: true }
        })
      );
    } else {
      yield put(
        commonActions.setCustomToast({
          open: true,
          variant: 'error',
          message: message || 'Invalid email/mobile or password.',
          title: 'Login Failed'
        })
      );
    }
  }
  yield put(commonActions.setApiLoading(false));
}



export default function* partnerOnboardedRequestSaga() {
  yield all([
    
    takeLatest(ACTIONS.REGISTER, registerSaga),
    takeLatest(ACTIONS.LOGIN,loginSaga)
  ]);
}

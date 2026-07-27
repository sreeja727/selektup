import { createAction } from '@reduxjs/toolkit';
import {
  all, call, delay, put, takeLatest
} from 'redux-saga/effects';
import { toaster } from '../../components/ui/toaster';
import { ACTION_TYPES, ACTIONS } from './actions';
import * as api from './api';

const MOCK_LATENCY_MS = 300;

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

export default function* categoryAccessSaga() {
  yield all([
    takeLatest(ACTIONS.FETCH_ACCESS_STATUS, fetchAccessStatusSaga),
    takeLatest(ACTIONS.REQUEST_ACCESS, requestAccessSaga),
    takeLatest(ACTIONS.FETCH_ADMIN_REQUESTS, fetchAdminRequestsSaga),
    takeLatest(ACTIONS.APPROVE_REQUEST, approveRequestSaga),
    takeLatest(ACTIONS.REJECT_REQUEST, rejectRequestSaga)
  ]);
}

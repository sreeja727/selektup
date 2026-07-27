import { createAction } from '@reduxjs/toolkit';
import { getApiActionType } from '../../utils/common';
import { STATE_REDUCER_KEY } from './constants';

const ACTIONS = {
  FETCH_ACCESS_STATUS: `${STATE_REDUCER_KEY}/FETCH_ACCESS_STATUS`,
  REQUEST_ACCESS: `${STATE_REDUCER_KEY}/REQUEST_ACCESS`,
  FETCH_ADMIN_REQUESTS: `${STATE_REDUCER_KEY}/FETCH_ADMIN_REQUESTS`,
  APPROVE_REQUEST: `${STATE_REDUCER_KEY}/APPROVE_REQUEST`,
  REJECT_REQUEST: `${STATE_REDUCER_KEY}/REJECT_REQUEST`
};

const ACTION_TYPES = getApiActionType(ACTIONS);

// payload: categorySlug
const fetchAccessStatus = createAction(ACTIONS.FETCH_ACCESS_STATUS);
// payload: { categorySlug, categoryTitle, categoryPrice }
const requestAccess = createAction(ACTIONS.REQUEST_ACCESS);
// payload: none (admin)
const fetchAdminRequests = createAction(ACTIONS.FETCH_ADMIN_REQUESTS);
// payload: requestId (admin)
const approveRequest = createAction(ACTIONS.APPROVE_REQUEST);
// payload: requestId (admin)
const rejectRequest = createAction(ACTIONS.REJECT_REQUEST);

export {
  ACTIONS,
  ACTION_TYPES,
  fetchAccessStatus,
  requestAccess,
  fetchAdminRequests,
  approveRequest,
  rejectRequest
};

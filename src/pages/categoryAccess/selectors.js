import { flow } from 'lodash-es';
import { ACCESS_STATUS, STATE_REDUCER_KEY } from './constants';

const getCategoryAccessState = (state) => state[STATE_REDUCER_KEY];

export const getStatusForCategory = (categorySlug) => flow(
  getCategoryAccessState,
  (state) => state.statusByCategory[categorySlug] || ACCESS_STATUS.NOT_REQUESTED
);

// Undefined until the first fetch for this category resolves — lets callers
// distinguish "haven't checked yet" from a confirmed NOT_REQUESTED.
export const getRawStatusForCategory = (categorySlug) => flow(
  getCategoryAccessState,
  (state) => state.statusByCategory[categorySlug]
);

export const getStatusLoading = flow(getCategoryAccessState, (state) => state.statusLoading);
export const getRequestLoading = flow(getCategoryAccessState, (state) => state.requestLoading);
export const getAdminRequests = flow(getCategoryAccessState, (state) => state.adminRequests);
export const getAdminRequestsLoading = flow(getCategoryAccessState, (state) => state.adminRequestsLoading);
export const getActionLoading = flow(getCategoryAccessState, (state) => state.actionLoading);

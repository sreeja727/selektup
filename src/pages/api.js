import { getUser } from '../utils/auth';
import { REQUEST_METHOD } from '../common/constant';
import { API_URL } from '../common/url';
import { ACTION_TYPES, ACTIONS } from './actions';
import { ACCESS_STATUS, REQUESTS_STORAGE_KEY } from './constants';

/* ===========================
   AUTH APIs
=========================== */

const registerApi = (data) => {
  return {
    url: API_URL.REGISTER,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.REGISTER_API],
      data,
    },
  };
};

const loginApi = (data) => {
  return {
    url: API_URL.LOGIN,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.LOGIN],
      data,
    },
  };
};

const forgotPasswordApi = (data) => {
  return {
    url: API_URL.FORGOT_PASSWORD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.FORGOT_PASSWORD],
      data,
    },
  };
};

const resetPasswordApi = (data) => {
  return {
    url: API_URL.RESET_PASSWORD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.RESET_PASSWORD],
      data,
    },
  };
};

/* ===========================
   CATEGORY ACCESS APIs
=========================== */

// Stands in for the backend today: every student's category-access request
// lives here, keyed by categorySlug + mobile, so the admin table and the
// student's own status check read the exact same source of truth.
// Swap these functions for real axios calls (see registerApi/loginApi above
// for the pattern) once the Spring Boot endpoints exist — actions/saga/slice
// won't need to change.

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeAll(requests) {
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

function requestId(categorySlug, mobile) {
  return `${categorySlug}::${mobile}`;
}

async function getAccessStatus(categorySlug) {
  const user = getUser();
  if (!user) return ACCESS_STATUS.NOT_REQUESTED;
  const found = readAll().find(
    (r) => r.id === requestId(categorySlug, user.identifier)
  );
  return found ? found.status : ACCESS_STATUS.NOT_REQUESTED;
}

async function submitAccessRequest({ categorySlug, categoryTitle, categoryPrice }) {
  const user = getUser();
  if (!user) throw new Error('You must be logged in to request access.');

  const all = readAll();
  const id = requestId(categorySlug, user.identifier);
  const existingIndex = all.findIndex((r) => r.id === id);
  const record = {
    id,
    studentName: user.name,
    studentEmail: user.email,
    studentMobile: user.identifier,
    categorySlug,
    categoryTitle,
    categoryPrice,
    status: ACCESS_STATUS.PENDING,
    requestedDate: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    all[existingIndex] = record;
  } else {
    all.push(record);
  }
  writeAll(all);
  return record.status;
}

async function getAllRequests() {
  return readAll().sort(
    (a, b) => new Date(b.requestedDate) - new Date(a.requestedDate)
  );
}

async function setRequestStatus(id, status) {
  const all = readAll();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Request not found.');
  all[index] = { ...all[index], status };
  writeAll(all);
  return all[index];
}

// This one hits the real Spring Boot backend (GET /api/test-categories),
// following the same request-descriptor shape as registerApi/loginApi above —
// consumed via utils/http's handleAPIRequest in saga.js, not the mock helpers above.
function getTestCategoriesApi() {
  return {
    url: API_URL.TEST_CATEGORIES,
    method: REQUEST_METHOD.GET,
    payload: {
      types: ACTION_TYPES[ACTIONS.FETCH_TEST_CATEGORIES]
    }
  };
}

/* ===========================
   EXPORTS
=========================== */

export {
  registerApi,
  loginApi,
  forgotPasswordApi,
  resetPasswordApi,

  getAccessStatus,
  submitAccessRequest,
  getAllRequests,
  setRequestStatus,
  getTestCategoriesApi,
};

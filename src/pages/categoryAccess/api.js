import { getUser } from '../../utils/auth';
import { ACCESS_STATUS, REQUESTS_STORAGE_KEY } from './constants';

// Stands in for the backend today: every student's category-access request
// lives here, keyed by categorySlug + mobile, so the admin table and the
// student's own status check read the exact same source of truth.
// Swap these functions for real axios calls (see pages/api.js for the
// pattern) once the Spring Boot endpoints exist — actions/saga/slice above
// this layer won't need to change.

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

export async function getAccessStatus(categorySlug) {
  const user = getUser();
  if (!user) return ACCESS_STATUS.NOT_REQUESTED;
  const found = readAll().find(
    (r) => r.id === requestId(categorySlug, user.identifier)
  );
  return found ? found.status : ACCESS_STATUS.NOT_REQUESTED;
}

export async function submitAccessRequest({ categorySlug, categoryTitle, categoryPrice }) {
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

export async function getAllRequests() {
  return readAll().sort(
    (a, b) => new Date(b.requestedDate) - new Date(a.requestedDate)
  );
}

export async function setRequestStatus(id, status) {
  const all = readAll();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Request not found.');
  all[index] = { ...all[index], status };
  writeAll(all);
  return all[index];
}

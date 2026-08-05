import { flow } from 'lodash-es';
import { ACCESS_STATUS, STATE_REDUCER_KEY } from './constants';

const getPagesData = (state) => state[STATE_REDUCER_KEY];

export const getCommonConfigSelector = flow(getPagesData);

/* ===========================
   AUTH
=========================== */

const registerData = (state) => state.registerData;
export const getRegisterData = flow(
  getPagesData,
  registerData
);

const registerError = (state) => state.registerError;
export const getRegisterError = flow(
  getPagesData,
  registerError
);

const loginData = (state) => state.loginData;
export const getLoginData = flow(
  getPagesData,
  loginData
);

const forgotPasswordData = (state) => state.forgotPasswordData;
export const getForgotPasswordData = flow(
  getPagesData,
  forgotPasswordData
);

const resetPasswordData = (state) => state.resetPasswordData;
export const getResetPasswordData = flow(
  getPagesData,
  resetPasswordData
);

const changePasswordData = (state) => state.changePasswordData;
export const getChangePasswordData = flow(
  getPagesData,
  changePasswordData
);

/* ===========================
   COMMON (loading / toast / navigation)
=========================== */

const apiLoading = (state) => state.apiLoading;
export const getApiLoading = flow(
  getPagesData,
  apiLoading
);

const navigation = (state) => state.navigation;
export const getNavigation = flow(
  getPagesData,
  navigation
);

const customToast = (state) => state.customToast;
export const getCustomToast = flow(
  getPagesData,
  customToast
);

/* ===========================
   CATEGORY ACCESS
=========================== */

export const getStatusForCategory = (categorySlug) => flow(
  getPagesData,
  (state) => state.statusByCategory[categorySlug] || ACCESS_STATUS.NOT_REQUESTED
);

// Undefined until the first fetch for this category resolves — lets callers
// distinguish "haven't checked yet" from a confirmed NOT_REQUESTED.
export const getRawStatusForCategory = (categorySlug) => flow(
  getPagesData,
  (state) => state.statusByCategory[categorySlug]
);

export const getStatusLoading = flow(getPagesData, (state) => state.statusLoading);
export const getRequestLoading = flow(getPagesData, (state) => state.requestLoading);
export const getAdminRequests = flow(getPagesData, (state) => state.adminRequests);
export const getAdminRequestsLoading = flow(getPagesData, (state) => state.adminRequestsLoading);
export const getActionLoading = flow(getPagesData, (state) => state.actionLoading);
export const getTestCategories = flow(getPagesData, (state) => state.testCategories);
export const getTestCategoriesLoading = flow(getPagesData, (state) => state.testCategoriesLoading);
export const getTestCategoryDetail = flow(getPagesData, (state) => state.testCategoryDetail);
export const getTestCategoryDetailLoading = flow(getPagesData, (state) => state.testCategoryDetailLoading);
export const getTestDetail = flow(getPagesData, (state) => state.testDetail);
export const getTestDetailLoading = flow(getPagesData, (state) => state.testDetailLoading);
export const getRequestCategoryAccessLoading = flow(getPagesData, (state) => state.requestCategoryAccessLoading);
export const getTestAttempt = flow(getPagesData, (state) => state.testAttempt);
export const getAdminStudents = flow(getPagesData, (state) => state.adminStudents);
export const getAdminStudentsLoading = flow(getPagesData, (state) => state.adminStudentsLoading);
export const getAdminStudentsTotalPages = flow(getPagesData, (state) => state.adminStudentsTotalPages);
export const getAdminStudentsPageSize = flow(getPagesData, (state) => state.adminStudentsPageSize);
export const getAdminStudentsCurrentPage = flow(getPagesData, (state) => state.adminStudentsCurrentPage);
export const getAdminEnquiries = flow(getPagesData, (state) => state.adminEnquiries);
export const getAdminEnquiriesLoading = flow(getPagesData, (state) => state.adminEnquiriesLoading);
export const getContactSubmitting = flow(getPagesData, (state) => state.contactSubmitting);
export const getContactSuccessMessage = flow(getPagesData, (state) => state.contactSuccessMessage);
export const getContactError = flow(getPagesData, (state) => state.contactError);
export const getTestQuestions = flow(getPagesData, (state) => state.testQuestions);
export const getTestQuestionsLoading = flow(getPagesData, (state) => state.testQuestionsLoading);
export const getSubmitTestLoading = flow(getPagesData, (state) => state.submitTestLoading);
export const getSubmitTestResult = flow(getPagesData, (state) => state.submitTestResult);
export const getStartTestLoading = flow(getPagesData, (state) => state.startTestLoading);
export const getSubmission = flow(getPagesData, (state) => state.submission);
export const getSubmissionLoading = flow(getPagesData, (state) => state.submissionLoading);
export const getSubmissionReview = flow(getPagesData, (state) => state.submissionReview);
export const getSubmissionReviewLoading = flow(getPagesData, (state) => state.submissionReviewLoading);
export const getAddQuestionLoading = flow(getPagesData, (state) => state.addQuestionLoading);
export const getAddQuestionResult = flow(getPagesData, (state) => state.addQuestionResult);
export const getAddQuestionError = flow(getPagesData, (state) => state.addQuestionError);
export const getUpdateQuestionLoading = flow(getPagesData, (state) => state.updateQuestionLoading);
export const getUpdateQuestionResult = flow(getPagesData, (state) => state.updateQuestionResult);
export const getUpdateQuestionError = flow(getPagesData, (state) => state.updateQuestionError);
export const getBulkUploadLoading = flow(getPagesData, (state) => state.bulkUploadLoading);
export const getBulkUploadResult = flow(getPagesData, (state) => state.bulkUploadResult);
export const getBulkUploadError = flow(getPagesData, (state) => state.bulkUploadError);
export const getDeleteQuestionLoading = flow(getPagesData, (state) => state.deleteQuestionLoading);
export const getDeleteAllQuestionsLoading = flow(getPagesData, (state) => state.deleteAllQuestionsLoading);
export const getAdminDashboardSummary = flow(getPagesData, (state) => state.adminDashboardSummary);
export const getAdminDashboardSummaryLoading = flow(getPagesData, (state) => state.adminDashboardSummaryLoading);
export const getQuestionTemplateLoading = flow(getPagesData, (state) => state.questionTemplateLoading);
export const getQuestionTemplateFile = flow(getPagesData, (state) => state.questionTemplateFile);
export const getAdminTestQuestions = flow(getPagesData, (state) => state.adminTestQuestions);
export const getAdminTestQuestionsTotal = flow(getPagesData, (state) => state.adminTestQuestionsTotal);
export const getAdminTestQuestionsLoading = flow(getPagesData, (state) => state.adminTestQuestionsLoading);

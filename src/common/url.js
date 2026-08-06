export const BASE_URL = import.meta.env.VITE_API_URL

export const API_URL={
    REGISTER:'auth/register',
    LOGIN:'auth/login',
    FORGOT_PASSWORD:'auth/forgot-password',
    VERIFY_OTP:'auth/verify-otp',
    RESET_PASSWORD:'auth/reset-password-with-token',
    CHANGE_PASSWORD:'auth/change-password',
    TEST_CATEGORIES:'test-categories',
    ADMIN_CATEGORY_ACCESS:'admin/category-access',
    ADMIN_DASHBOARD_SUMMARY:'admin/dashboard/summary',
    ADMIN_STUDENTS:'admin/students',
    ADMIN_STUDENTS_PAGINATED:'admin/students/paginated',
    ADMIN_ENQUIRIES:'admin/enquiries',
    ADMIN_RESULTS:'admin/results',
    ADMIN_RESULTS_STUDENTS:'admin/results/students',
    ADMIN_RESULTS_STUDENT_CATEGORY:'admin/results/student',
    ADMIN_RESULTS_REVIEW:'admin/results/review',
    ADMIN_RESULTS_ATTEMPTS:'admin/results/attempts',
    HOME_CONTACT:'home/contact',
    TESTS:'tests',
    ADMIN_TESTS:'admin/tests'
}
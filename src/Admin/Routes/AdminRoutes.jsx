

import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import Dashboard from "../components/Dashboard";
import EnquiriesList from "../components/Enquiries/EnquiriesList";
import EnquiryDetails from "../components/Enquiries/EnquiryDetails";
import StudentsList from "../components/Students/StudentsList";
import TestSeriesList from "../components/Testseries/List";
import AddTestSeries from "../components/Testseries/Add";
import QuestionsList from "../components/Questions/QuestionsList";
import QuestionsAdd from "../components/Questions/QuestionsAdd";
import QuestionsEdit from "../components/Questions/QuestionsEdit";
import QuestionsView from "../components/Questions/QuestionsView";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Redirect /admin to /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Enquiries */}
        <Route path="enquiries" element={<EnquiriesList />} />
        <Route path="enquiries/:id" element={<EnquiryDetails />} />

        {/* Students */}
        <Route path="students" element={<StudentsList />} />

        {/* Test Series */}
        <Route path="test-series" element={<TestSeriesList />} />
        <Route path="test-series/add" element={<AddTestSeries />} />

        {/* Questions */}
        <Route path="questions" element={<QuestionsList />} />
        <Route path="questions/add" element={<QuestionsAdd />} />
        <Route path="questions/edit/:id" element={<QuestionsEdit />} />
        <Route path="questions/:id" element={<QuestionsView />} />
      </Route>
    </Routes>
  );
}
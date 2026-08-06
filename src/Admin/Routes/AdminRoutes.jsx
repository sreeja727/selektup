import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import Dashboard from "../components/Dashboard";
import EnquiriesList from "../components/Enquiries/EnquiriesList";
import EnquiryDetails from "../components/Enquiries/EnquiryDetails";
import TestSeriesList from "../components/Testseries/List";
import AddTestSeries from "../components/Testseries/Add";
import QuestionsList from "../components/Questions/QuestionsList";
import QuestionsAdd from "../components/Questions/QuestionsAdd";
import QuestionsEdit from "../components/Questions/QuestionsEdit";
import QuestionsView from "../components/Questions/QuestionsView";
import ExamAccess from "../components/Students/ExamAccess";
import StudentDetails from "../components/Students/StudentDetails";
import ResultsList from "../components/Results/ResultsList";
import StudentCategoryResults from "../components/Results/StudentCategoryResults";
import ResultReview from "../components/Results/ResultReview";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="enquiries" element={<EnquiriesList />} />
        <Route path="enquiries/:id" element={<EnquiryDetails />} />

        <Route path="test-series" element={<TestSeriesList />} />
        <Route path="test-series/add" element={<AddTestSeries />} />

        <Route path="questions" element={<QuestionsList />} />
        <Route path="questions/add" element={<QuestionsAdd />} />
        <Route path="questions/edit/:id" element={<QuestionsEdit />} />
        <Route path="questions/:id" element={<QuestionsView />} />

        <Route path="students" element={<Navigate to="exam-access" replace />} />
        <Route path="students/exam-access" element={<ExamAccess />} />
        <Route path="students/details" element={<StudentDetails />} />

        <Route path="results" element={<ResultsList />} />
        <Route path="results/student/:studentId/category/:categoryId" element={<StudentCategoryResults />} />
        <Route path="results/attempt/:attemptId/review" element={<ResultReview />} />
      </Route>
    </Routes>
  );
}

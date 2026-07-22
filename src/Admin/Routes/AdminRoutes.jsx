import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
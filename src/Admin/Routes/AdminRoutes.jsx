import { Routes, Route } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";

import Dashboard from "../pages/Dashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route
          path="/dashboard/"
          element={<Dashboard />}
        />
      </Route>
    </Routes>
  );
}
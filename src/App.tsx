import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ui/components/common/ProtectedRoute";
import LandingLayout from "./ui/components/layout/LandingLayout";
import AppLayout from "./ui/components/layout/AppLayout";
import LandingPage from "./ui/pages/LandingPage";
import LoginPage from "./ui/pages/LoginPage";
import RegisterPage from "./ui/pages/RegisterPage";
import DashboardPage from "./ui/pages/DashboardPage";
import EditorPage from "./ui/pages/EditorPage";
import ProfilePage from "./ui/pages/ProfilePage";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
            <Route element={<LandingLayout />}>
                <Route path="/" element={<LandingPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/documents/:id" element={<EditorPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
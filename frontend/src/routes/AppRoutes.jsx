import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import DashboardPage from "../pages/DashboardPage";
import MoodEnergyStep from "../pages/tracker/MoodEnergyStep";
import FactorsActivitiesStep from "../pages/tracker/FactorsActivitiesStep";
import NoteStep from "../pages/tracker/NoteStep";
import ConstructionPage from "../pages/ConstructionPage";
import NotFoundPage from "../pages/NotFoundPage";
import HistoryPage from "../pages/HistoryPage";
import SettingsPage from "../pages/SettingsPage";

import DashboardLayout from "../layouts/DashboardLayout";
import TrackerLayout from "../layouts/TrackerLayout";
import { ProtectedRoute, PublicOnlyRoute } from "../components/auth/AuthGuards";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<DashboardLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <ConstructionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendation"
          element={
            <ProtectedRoute>
              <ConstructionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracker"
          element={
            <ProtectedRoute>
              <TrackerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="mood-energy" replace />} />
          <Route path="mood-energy" element={<MoodEnergyStep />} />
          <Route path="factors-activities" element={<FactorsActivitiesStep />} />
          <Route path="note" element={<NoteStep />} />
        </Route>

      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

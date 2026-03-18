import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/common";
import {
  Home,
  Components,
  Configurator,
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  AdminDashboard,
  AdminUsers,
} from "./pages";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/components" element={<Components />} />
      <Route path="/configurateur" element={<Configurator />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes - User */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div>Page Profil (TODO)</div>
          </ProtectedRoute>
        }
      />

      {/* Protected routes - Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<div>Page non trouvée</div>} />
    </Routes>
  );
}

export default App;

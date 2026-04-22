import { Outlet, Routes, Route } from "react-router-dom";
import {
  ProtectedRoute,
  ToastContainer,
  CustomCursor,
  GrainCanvas,
} from "./components/common";
import { Header, Footer, AdminLayout } from "./components/layout";
import { useScrollReveal } from "./utils/reveal";
import {
  Home,
  NotFound,
  Components,
  Configurator,
  ProductDetail,
  Profile,
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  AdminDashboard,
  AdminUsers,
  AdminProducts,
  CGV,
  PrivacyPolicy,
  LegalNotice,
} from "./pages";

function PublicLayout() {
  return (
    <>
      <Header />
      <main className="page">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  useScrollReveal();

  return (
    <>
      <CustomCursor />
      <GrainCanvas />
      <ToastContainer />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/components" element={<Components />} />
          <Route path="/configurateur" element={<Configurator />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/confidentialite" element={<PrivacyPolicy />} />
          <Route path="/mentions-legales" element={<LegalNotice />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout title="Dashboard" ghost="DASH">
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout title="Utilisateurs" ghost="USERS">
                <AdminUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout title="Produits" ghost="STOCK">
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

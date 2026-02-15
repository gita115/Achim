// src/app/Router.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import AdminImages from "../pages/AdminImages"
import AdminCategories from "../pages/AdminCategories"
import AdminTags from "../pages/AdminTags"
import AdminDashboard from "../pages/AdminDashboard"
import Purchases from "../pages/Purchases"
import Gallery from "../pages/Gallery"
import Cart from "../pages/Cart"
import Login from "../pages/Login"

import Layout from "../components/layout/Layout"
import AdminLayout from "../components/layout/AdminLayout"
import MainLayout from "../components/layout/MainLayout"

const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  return isAdmin ? children : <Navigate to="/login" />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Gallery />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/images" element={
            <ProtectedAdminRoute>
              <AdminImages />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedAdminRoute>
              <AdminCategories />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/tags" element={
            <ProtectedAdminRoute>
              <AdminTags />
            </ProtectedAdminRoute>
          } />
          <Route path="/purchases" element={
            <ProtectedAdminRoute>
              <Purchases />
            </ProtectedAdminRoute>
          } />
        </Route>
      </Route>

      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  )
}

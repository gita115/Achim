// import { Routes, Route, Navigate } from "react-router-dom"
// import MainLayout from "../components/layout/MainLayout"
// import AdminLayout from "../components/layout/AdminLayout"
// import Gallery from "../pages/Gallery"
// import Cart from "../pages/Cart"
// import Login from "../pages/Login"
// import AdminDashboard from "../pages/AdminDashboard"
// import AdminImages from "../pages/AdminImages"
// import AdminTags from "../pages/AdminTags"
// import AdminCategories from "../pages/AdminCategories"
// import Purchases from "../pages/Purchases"
// import AdminOrganizations from "../pages/AdminOrg"

// function RequireAuth({ children }: any) {
//   const org = localStorage.getItem("organization")
//   if (!org) return <Navigate to="/login" />
//   return children
// }

// export default function AppRouter() {
//   return (
//     <Routes>

//       <Route element={<MainLayout />}>
//         <Route path="/" element={<Gallery />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/cart" element={
//           <RequireAuth>
//             <Cart />
//           </RequireAuth>
//         } />
//       </Route>

//       <Route
//         path="/admin"
//         element={
//           <RequireAuth>
//             <AdminLayout />
//           </RequireAuth>
//         }
//       >
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="images" element={<AdminImages />} />
//         <Route path="tags" element={<AdminTags />} />
//         <Route path="categories" element={<AdminCategories />} />
//         <Route path="purchases" element={<Purchases />} />
//         <Route path="organization" element={<AdminOrganizations />} />
//       </Route>

//     </Routes>
//   )
// }
import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout"
import AdminLayout from "../components/layout/AdminLayout"
import Gallery from "../pages/Gallery"
import Login from "../pages/Login"
import AdminDashboard from "../pages/AdminDashboard"
import AdminImages from "../pages/AddImage"
import AdminTags from "../pages/AdminTags"
import AdminCategories from "../pages/AdminCategories"
import Purchases from "../pages/Purchases"
import AdminOrganizations from "../pages/AdminOrg"
import Checkout from "../pages/Checkout"
import EditImage from "../pages/EditImage"
import CartDrawer from "../components/CartDrawer"

function RequireAuth({ children }: any) {
  const org = localStorage.getItem("organization")
  if (!org) return <Navigate to="/login" />
  return children
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={
          <RequireAuth>
            <Gallery />
          </RequireAuth>
        }/>
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={
          <RequireAuth>
            <CartDrawer />
          </RequireAuth>
        } />
        <Route path="/checkout" element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        } />
      </Route>

      <Route path="/admin" element={
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="images" element={<AdminImages />} />
        <Route path="gallery" element={<Gallery isAdmin />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="organization" element={<AdminOrganizations />} />
        <Route path="images/edit/:id" element={<EditImage />} />

      </Route>
    </Routes>
  )
}

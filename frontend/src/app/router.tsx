import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import AdminDashboard from "../pages/AdminDashboard"
import Catalog from "../pages/Catalog"
import Login from "../pages/Login"
import AdminImages from "../pages/AdminImages"

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminImages" element={<AdminImages/>}/>

    </Routes>
  )
}

export default AppRouter

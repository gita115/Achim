import { Outlet, useNavigate } from "react-router-dom"
import { Button } from "../Ui"

export default function AdminLayout() {
  const navigate = useNavigate()
  const org = localStorage.getItem("organization")

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <div className="admin-links">
          <Button onClick={() => navigate("dashboard")}>Dashboard</Button>
          <Button onClick={() => navigate("images")}>Images</Button>
          <Button onClick={() => navigate("tags")}>Tags</Button>
          <Button onClick={() => navigate("categories")}>Categories</Button>
          <Button onClick={() => navigate("purchases")}>Purchases</Button>
          <Button onClick={() => navigate("organization")}>Organization</Button>
          <Button onClick={() => navigate("gallery")}>Gallery</Button>
        </div>
        {org && (
          <div className="admin-logout">
            <span>Hello, {org}</span>
            <Button variant="secondary" onClick={()=>{
              localStorage.clear()
              navigate("/login")
            }}>Logout</Button>
          </div>
        )}
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}

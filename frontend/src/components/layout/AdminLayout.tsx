import { Outlet, useNavigate } from "react-router-dom"
// import { Button } from "../Ui"

export default function AdminLayout() {
  const navigate = useNavigate()
  const org = localStorage.getItem("organization")

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <div className="admin-links">
          <button onClick={() => navigate("dashboard")}>  📊 Dashboard
</button>
          
          <button
          className={window.location.pathname.includes("images") ? "active" : ""} 
          onClick={() => navigate("images")}
          >
            🖼️ Images
          </button>
          <button 
          className={window.location.pathname.includes("tags") ? "active" : ""} 
          onClick={() => navigate("tags")}
          >
            🏷️ Tags
          </button>
          <button 
          className={window.location.pathname.includes("categories") ? "active" : ""} 
          onClick={() => navigate("categories")}
          >
            📁 Categories
          </button>
          <button 
          className={window.location.pathname.includes("purchases") ? "active" : ""} 
          onClick={() => navigate("purchases")}
          >
            🛒 Purchases
          </button>
          <button 
          className={window.location.pathname.includes("organization") ? "active" : ""} 
          onClick={() => navigate("organization")}
          >
            🏢 Organization
          </button>
          <button 
          className={window.location.pathname.includes("gallery") ? "active" : ""} 
          onClick={() => navigate("gallery")}
          >
            📷 Gallery
          </button>
        </div>
        {org && (
          <div className="admin-logout">
            <span>שלום {org}</span>
            <button className="secondary" onClick={()=>{
              localStorage.clear()
              navigate("/login")
            }}>Logout</button>
          </div>
        )}
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}

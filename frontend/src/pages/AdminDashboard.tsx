import { Link } from "react-router-dom"

export default function AdminDashboard() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Panel</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <Link to="/admin/images">Manage Images</Link>
        <Link to="/admin/categories">Manage Categories</Link>
        <Link to="/admin/tags">Manage Tags</Link>
        <Link to="/admin/purchases">View Purchases</Link>
      </div>
    </div>
  )
}

import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <div style={{
      width: 220,
      background: "#222",
      color: "white",
      padding: 20,
      minHeight: "100vh"
    }}>
      <h3>Admin</h3>
      <Link to="/admin">Dashboard</Link>
      <br />
      <Link to="/admin/images">Manage Images</Link>
    </div>
  )
}

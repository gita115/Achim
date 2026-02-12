import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <div style={{ width: 220, background: "#111", color: "#fff", padding: 20 }}>
      <h3>Admin</h3>
      <Link to="/admin">Dashboard</Link>
    </div>
  );
}

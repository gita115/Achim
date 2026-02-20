import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate()

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 250, background: "#111827", color: "#fff", padding: 30 }}>
        <h3>Admin</h3>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => navigate("dashboard")}>Dashboard</button>
          <button onClick={() => navigate("images")}>Images</button>
          <button onClick={() => navigate("tags")}>Tags</button>
          <button onClick={() => navigate("categories")}>Categories</button>
          <button onClick={() => navigate("purchases")}>Purchases</button>
          <button onClick={() => navigate("organization")}>Organization</button>
        </div>
      </aside>

      <div style={{ flex: 1, padding: 30, background: "#f3f4f6" }}>
        <Outlet />
      </div>
    </div>
  )
}

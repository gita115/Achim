import { Outlet, useNavigate } from "react-router-dom"
import { Button } from "../Ui"
export default function MainLayout() {
  const navigate = useNavigate()
  const org = localStorage.getItem("organization")

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f5f7fa", minHeight: "100vh" }}>
      <header
        style={{
          background: "#111827",
          color: "#fff",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Achim
        </h2>

        <div style={{ display: "flex", gap: 10 }}>
          {org ? (
            <>
              <span>{org}</span>
              <Button variant="secondary" onClick={() => {
                localStorage.clear()
                navigate("/login")
              }}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </header>

      <main style={{ padding: 30 }}>
        <Outlet />
      </main>
    </div>
  )
}

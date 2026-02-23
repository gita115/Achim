import { Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "../Ui"
import CartDrawer from "../CartDrawer"

export default function MainLayout() {
  const navigate = useNavigate()
  const org = localStorage.getItem("organization")
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="app-container">
      <header className="app-header">
        <h2 className="app-logo" onClick={() => navigate("/")}>Achim</h2>
        <div className="header-actions">
          {org ? (
            <>
              <span className="org-name">Hello, {org}</span>
              <Button variant="secondary" onClick={() => {
                localStorage.clear()
                navigate("/login")
              }}>
                Logout
              </Button>
              <Button onClick={() => setDrawerOpen(true)}>Cart</Button>
            </>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

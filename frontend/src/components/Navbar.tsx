import { Link } from "react-router-dom"

export default function Navbar() {
  const isAdmin = true

  return (
    <nav style={{ 
      background: "#111", 
      color: "white", 
      padding: 15,
      display: "flex",
      gap: 20
    }}>
      <Link to="/catalog" style={{ color: "white" }}>Catalog</Link>

      {isAdmin && (
        <>
          <Link to="/admin/images" style={{ color: "white" }}>Images</Link>
          <Link to="/admin/categories" style={{ color: "white" }}>Categories</Link>
          <Link to="/admin/tags" style={{ color: "white" }}>Tags</Link>
          <Link to="/admin/purchases" style={{ color: "white" }}>Purchases</Link>
        </>
      )}
    </nav>
  )
}

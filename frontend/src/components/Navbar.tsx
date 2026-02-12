import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 20, background: "#222", color: "#fff" }}>
      <Link to="/" style={{ marginRight: 15, color: "#fff" }}>Home</Link>
      <Link to="/admin" style={{ marginRight: 15, color: "#fff" }}>Admin</Link>
      <Link to="/login" style={{ color: "#fff" }}>Login</Link>
    </nav>
  );
}

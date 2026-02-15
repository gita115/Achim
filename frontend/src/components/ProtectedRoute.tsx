import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, role, userRole }: { children: JSX.Element, role: string, userRole: string }) {
  if (role !== userRole) return <Navigate to="/login" />
  return children
}

import React from "react"

type Props = {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "primary" | "danger" | "secondary"
}

export function Button({ children, onClick, type = "button", variant = "primary" }: Props) {
  const styles = {
    primary: {
      background: "#2563eb",
      color: "#fff"
    },
    danger: {
      background: "#dc2626",
      color: "#fff"
    },
    secondary: {
      background: "#e5e7eb",
      color: "#111"
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "10px 18px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontWeight: 500,
        ...styles[variant]
      }}
    >
      {children}
    </button>
  )
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}
    >
      {children}
    </div>
  )
}


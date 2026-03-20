import React from "react"

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  message?: string
}

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  message = "Are you sure?"
}: Props) {
  if (!open) return null

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div>{message}</div>

        <div className="confirm-actions">
          <button onClick={onCancel}>Cancel</button>
          <button className="danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
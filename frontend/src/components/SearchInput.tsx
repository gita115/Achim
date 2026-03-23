import React from "react"

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search..."
}: Props) {
  return (
    <div className="search">
      <input
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button
          className="clear"
          onClick={() => onChange("")}
        >
          ✕
        </button>
      )}
    </div>
  )
}
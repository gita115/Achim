import { useState } from "react"

export default function Cart() {
  const [items, setItems] = useState<any[]>([])

  return (
    <div>
      <h2>Cart</h2>
      {items.map(i => (
        <div key={i.id}>{i.title}</div>
      ))}
      <button>Pay</button>
    </div>
  )
}

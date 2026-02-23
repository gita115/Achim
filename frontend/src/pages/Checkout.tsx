import { useState } from "react"
import { useCart } from "../context/CartContext"

export default function Checkout() {
  const { items, clearCart } = useCart()
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState("")

  const total = items.reduce((sum, i) => sum + i.price, 0)

  const handlePay = () => {
    setError("")
    if (cardNumber === "0909" && expiry === "0909" && cvc === "999") {
      setPaid(true)
      alert("Payment Successful ✔")
    } else {
      setError("Invalid card info")
    }
  }

  const handleDownload = (item: any) => {
    if (!paid) return
    const link = document.createElement("a")
    link.href = item.filePath
    link.download = item.title
    link.click()
  }

  if (items.length === 0) return <p>Your cart is empty</p>

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20, background: "white", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
      <h2>Checkout</h2>
      {items.map(i => (
        <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
          <span>{i.title}</span>
          <span>{i.price} ₪</span>
          {paid && <button onClick={() => handleDownload(i)}>Download</button>}
        </div>
      ))}

      {!paid && (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <input placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
          <input placeholder="Expiry MMYY" value={expiry} onChange={e => setExpiry(e.target.value)} />
          <input placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value)} />
          {error && <span style={{ color: "red" }}>{error}</span>}
          <button onClick={handlePay} className="primary-btn">Pay {total} ₪</button>
        </div>
      )}

      {paid && <p style={{ marginTop: 10, color: "green", fontWeight: 700 }}>Payment complete! You can download your images once.</p>}
    </div>
  )
}

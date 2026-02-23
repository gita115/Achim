import { useCart } from "../context/CartContext"
import { purchaseService } from "../services/purchaseService"

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart()

  const total = items.reduce((sum, i) => sum + i.price, 0)

  const handleCheckout = async () => {
    if (items.length === 0) return alert("Cart is empty")

    await purchaseService.pay(items.map(i => i.id))
    alert("Payment Successful ✔")
    clearCart()
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {items.length === 0 && <p>Your cart is empty</p>}

      {items.map(i => (
        <div key={i.id} className="cart-row">
          <span>{i.title}</span>
          <span>{i.price} ₪</span>
          <button onClick={() => removeFromCart(i.id)}>Remove</button>
        </div>
      ))}

      <h3>Total: {total} ₪</h3>

      <button onClick={handleCheckout}>
        Proceed to Payment
      </button>
    </div>
  )
}

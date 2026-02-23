import { useCart } from "../context/CartContext"
import { purchaseService } from "../services/purchaseService"

export default function CartDrawer({ open, onClose }: any) {
  const { items, removeFromCart, clearCart } = useCart()
  const total = items.reduce((sum, i) => sum + i.price, 0)

  const handleCheckout = async () => {
    if (!items.length) return
    await purchaseService.pay(items.map(i => i.id))
    clearCart()
    alert("Payment Successful ✔")
    onClose()
  }

  return (
    <div className={`drawer ${open ? "open" : ""}`}>
      <div className="drawer-content">
        <h3>Your Cart</h3>

        {items.length === 0 && <p>Cart is empty</p>}

        {items.map(i => (
          <div key={i.id} className="cart-row">
            <img src={`http://localhost:5000${i.thumbnailPath}`} className="cart-thumb" style={{ width: "50px", height: "auto" }} />
            <div className="cart-info">
              <span>{i.title}</span>
              <span>{i.price} ₪</span>
            </div>
            <button onClick={() => removeFromCart(i.id)}>✕</button>
          </div>
        ))}

        <h4>Total: {total} ₪</h4>

        <button onClick={handleCheckout} className="primary-btn checkout-btn">Proceed to Payment</button>
        <button onClick={onClose} className="secondary-btn">Close</button>
      </div>
    </div>
  )
}

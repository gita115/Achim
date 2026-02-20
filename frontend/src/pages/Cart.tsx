import { useCart } from "../context/CartContext"
import { purchaseService } from "../services/purchaseService"

export default function Cart() {
  const { items, clearCart } = useCart()

  const handleCheckout = async () => {
    await purchaseService.pay(items.map((i: any) => i.id))
    alert("Payment Successful ✔")
    clearCart()
  }

  return (
    <div>
      <h2>Cart</h2>

      {items.map((i:any) => (
        <div key={i.id}>
          {i.title} - {i.price} ₪
        </div>
      ))}

      <button onClick={handleCheckout}>Pay</button>
    </div>
  )
}

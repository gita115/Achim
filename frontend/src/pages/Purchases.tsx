import { useEffect, useState } from "react"
import { purchaseService } from "../services/purchaseService"
import { Card } from "../components/Ui"
import type { Purchase } from "../types/models"

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  const load = async () => {
    const res = await purchaseService.getAll()
    setPurchases(res.data)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="admin-page">
      <h2>Purchases</h2>

      <div className="grid">
        {purchases.map(p => (
          <Card key={p.id}>
            <p>Image ID: {p.imageId}</p>
            <p>Date: {new Date(p.purchaseDate).toLocaleDateString()}</p>
            {/* <p>Paid: {p.isPaid ? "Yes" : "No"}</p> */}
          </Card>
        ))}
      </div>
    </div>
  )
}

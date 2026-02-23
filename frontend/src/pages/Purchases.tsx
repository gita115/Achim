import { useEffect, useState } from "react"
import { purchaseService } from "../services/purchaseService"

export default function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([])

  const load = async () => {
    const res = await purchaseService.getAll()
    setPurchases(res)
  }

  useEffect(() => {
    load()
  }, [])

  const download = (id: number) => {
    window.open(`http://localhost:5000/api/downloads/${id}`)
  }

  return (
    <div className="grid">
      {purchases.map(p => (
        <div key={p.id} className="purchase-card">
          <p>{p.image.title}</p>
          <button onClick={() => download(p.imageId)}>
            Download
          </button>
        </div>
      ))}
    </div>
  )
}

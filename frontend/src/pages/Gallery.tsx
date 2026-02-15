import { useEffect, useState } from "react"
import { imageService } from "../services/imageService"

export default function Gallery() {
  const [images, setImages] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const data = await imageService.getAll(search)
    setImages(data)
  }

  return (
    <div>
      <input
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button onClick={load}>Search</button>

      {images.map(img => (
        <div key={img.id}>
          <h3>{img.title}</h3>
          <p>{img.price} ₪</p>
        </div>
      ))}
    </div>
  )
}

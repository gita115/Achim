import { useEffect, useState } from "react"
import {imageService} from "../services/imageService"
import ImageCard from "../components/ImageCard"
import type { Image } from "../types/models"

export default function CatalogPage() {
  const [images, setImages] = useState<Image[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    imageService.getAll().then(setImages)
  }, [])

  const filtered = images.filter((i: any) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <input 
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {filtered.map((img: any) => (
          <ImageCard key={img.id} image={img} />
        ))}
      </div>
    </div>
  )
}

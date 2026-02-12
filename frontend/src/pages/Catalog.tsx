import { useEffect, useState } from "react"
import type { Image } from "../types/models"
import { imagesService } from "../api/imageService"

export default function Catalog() {
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    imagesService.getAll().then(setImages)
  }, [])

  return (
    <div>
      <h2>Catalog</h2>

      {images.map(i => (
        <div key={i.id}>
          {i.title} - ₪{i.price}
        </div>
      ))}
    </div>
  )
}

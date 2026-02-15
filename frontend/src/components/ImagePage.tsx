import { useEffect, useState } from "react"
import {imageService} from "../services/imageService"
import ImageForm from "../components/ImageForm"
import type { Image } from "../types/models"

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([])
  const [editing, setEditing] = useState<Image | null>(null)

  const load = async () => {
    const data = await imageService.getAll()
    setImages(data)
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: number) => {
    await imageService.remove(id)
    load()
  }

  return (
    <div>
      <h2>Manage Images</h2>

      <ImageForm 
        editing={editing} 
        onSaved={() => {
          setEditing(null)
          load()
        }} 
      />

      <hr />

      {images.map(img => (
        <div key={img.id} style={{ marginBottom: 10 }}>
          {img.title} - ₪{img.price}
          <button onClick={() => setEditing(img)}>Edit</button>
          <button onClick={() => handleDelete(img.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

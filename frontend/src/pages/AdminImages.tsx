import { useState } from "react"
import type { Image } from "../types/models"
import { imagesService } from "../api/imageService"

export default function AdminImages() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState(0)

  const handleSubmit = async () => {
    const newImage: Image = {
      id: 0,
      title,
      description: "",
      categoryId: 1,
      photographer: "Admin",
      year: 2024,
      filePath: "",
      thumbnailPath: "",
      isActive: true,
      price,
      tags: []
    }

    await imagesService.create(newImage)
    alert("Image added")
  }

  return (
    <div>
      <h2>Add Image</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(Number(e.target.value))}
      />

      <button onClick={handleSubmit}>
        Save
      </button>
    </div>
  )
}

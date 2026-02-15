import { useEffect, useState } from "react"
import {imageService }from "../services/imageService"
import {categoryService} from "../services/categoryService"
import type { Category } from "../types/models"

export default function AdminImages() {
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<number>()
  const [photographer, setPhotographer] = useState("")
  const [year, setYear] = useState<number>(2024)
  const [price, setPrice] = useState<number>(0)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const data = await categoryService.getAll()
    setCategories(data)
  }

  const handleSubmit = async () => {
    if (!categoryId) return alert("Select category")

    const newImage = {
      id: 0,
      title,
      description,
      categoryId,
      photographer,
      year,
      filePath: "",
      thumbnailPath: "",
      isActive: true,
      price
    }

    try {
      await imageService.create(newImage)
      alert("Image created")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Add Image</h2>

      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" onChange={e => setDescription(e.target.value)} />

      <select onChange={e => setCategoryId(Number(e.target.value))}>
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input placeholder="Photographer" onChange={e => setPhotographer(e.target.value)} />
      <input type="number" placeholder="Year" onChange={e => setYear(Number(e.target.value))} />
      <input type="number" placeholder="Price" onChange={e => setPrice(Number(e.target.value))} />

      <button onClick={handleSubmit}>Save Image</button>
    </div>
  )
}

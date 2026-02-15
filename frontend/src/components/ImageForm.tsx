import { useEffect, useState } from "react"
import {imageService} from "../services/imageService"
import {categoryService} from "../services/categoryService"
import {tagService} from "../services/tagService"
import type { Category, Image, Tag } from "../types/models"

interface Props {
  editing: Image | null
  onSaved: () => void
}

export default function ImageForm({ editing, onSaved }: Props) {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState(0)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    categoryService.getAll().then(setCategories)
    tagService.getAll().then(setTags)
  }, [])

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setPrice(editing.price)
      setCategoryId(editing.categoryId)
    }
  }, [editing])

  const handleSubmit = async () => {
    if (!categoryId) return

    await imageService.create({
      id: editing?.id ?? 0,
      title,
      description: "",
      categoryId,
      photographer: "Admin",
      year: 2024,
      filePath: "",
      thumbnailPath: "",
      isActive: true,
      price,
      tags: []
    })

    onSaved()
  }

  return (
    <div>
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

      <select 
        value={categoryId ?? ""}
        onChange={e => setCategoryId(Number(e.target.value))}
      >
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <button onClick={handleSubmit}>
        {editing ? "Update" : "Create"}
      </button>
    </div>
  )
}

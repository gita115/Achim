import { useEffect, useState } from "react"
import {categoryService} from "../services/categoryService"
import type { Category } from "../types/models"

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<number | null>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const data = await categoryService.getAll()
    setCategories(data)
  }

  const handleSubmit = async () => {
    if (!name) return

    await categoryService.create({
      id: 0,
      name,
      parentCategoryId: parentId
    })

    setName("")
    setParentId(null)
    load()
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Manage Categories</h2>

      <input
        placeholder="Category Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <select
        value={parentId ?? ""}
        onChange={e =>
          setParentId(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">No Parent</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button onClick={handleSubmit}>Add Category</button>

      <hr />

      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {c.name} {c.parentCategoryId && "(Child)"}
          </li>
        ))}
      </ul>
    </div>
  )
}

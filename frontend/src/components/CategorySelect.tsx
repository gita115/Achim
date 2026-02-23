import { useState, useMemo } from "react"
import type { Category } from "../types/models"

interface Props {
  categories: Category[]
  selectedId: number
  onChange: (id: number) => void
}

export default function CategorySelect({ categories, selectedId, onChange }: Props) {
  const [search, setSearch] = useState("")

  const filteredCategories = useMemo(() => {
    return categories
      .map(cat => ({
        ...cat,
        subCategories: cat.subCategories?.filter(sub =>
          sub.name.toLowerCase().includes(search.toLowerCase())
        )
      }))
      .filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        (cat.subCategories && cat.subCategories.length > 0)
      )
  }, [categories, search])

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search categories"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="hidden"
      />

      <select
        value={selectedId}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm hover:shadow transition"
      >
        <option value={0}>בחר קטגוריה</option>
        {filteredCategories.map(parent => (
          <div key={parent.id}>
            <option value={parent.id} className="font-bold">
              {parent.name}
            </option>
            {parent.subCategories?.map(sub => (
              <option key={sub.id} value={sub.id} className="pl-4">
                └── {sub.name}
              </option>
            ))}
          </div>
        ))}
      </select>
    </div>
  )
}

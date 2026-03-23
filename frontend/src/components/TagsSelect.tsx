
import { useState, useMemo } from "react"
import type { Tag } from "../types/models"

interface Props {
  tags: Tag[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export default function TagsSelect({
  tags,
  selectedIds,
  onChange
}: Props) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return tags?.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [tags, search])

  const toggleTag = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="tags-picker">

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="חיפוש תגיות..."
        className="tags-picker__search"
      />

      <div className="tags-picker__grid">
        {filtered?.map(tag => {
          const selected = selectedIds.includes(tag.id)

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`tags-picker__tag ${selected ? "selected" : ""}`}
            >
              {tag.name}
            </button>
          )
        })}

        {filtered?.length === 0 && (
          <div className="tags-picker__no-results">
            לא נמצאו תוצאות
          </div>
        )}
      </div>

    </div>
  )
}

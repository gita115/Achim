import { useEffect, useState } from "react"
import {tagService} from "../services/tagService"
import type { Tag } from "../types/models"

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState("")

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const data = await tagService.getAll()
    setTags(data)
  }

  const handleSubmit = async () => {
    if (!name) return

    await tagService.create({
      id: 0,
      name
    })

    setName("")
    load()
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Manage Tags</h2>

      <input
        placeholder="Tag Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button onClick={handleSubmit}>Add Tag</button>

      <ul>
        {tags.map(t => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </div>
  )
}

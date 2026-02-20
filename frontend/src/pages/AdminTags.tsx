import { useEffect, useState } from "react"
import { tagService } from "../services/tagService"
import { Button, Card } from "../components/Ui"
import type { Tag } from "../types/models"

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState("")

  const load = async () => {
    const res = await tagService.getAll()
    setTags(res)
  }

  useEffect(() => {
    load()
  }, [])

  const addTag = async () => {
    await tagService.create({ name })
    setName("")
    load()
  }

  const deleteTag = async (id: number) => {
    await tagService.remove(id)
    load()
  }

  return (
    <div>
      <h2>Tags</h2>

      <div className="form-row">
        <input value={name} onChange={e => setName(e.target.value)} />
        <Button onClick={addTag}>Add</Button>
      </div>

      {tags.map(t => (
        <Card key={t.id}>
          {t.name}
          <Button onClick={() => deleteTag(t.id)}>Delete</Button>
        </Card>
      ))}
    </div>
  )
}

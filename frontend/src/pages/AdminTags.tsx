// import { useEffect, useState } from "react"
// import { tagService } from "../services/tagService"
// import { Button, Card } from "../components/Ui"
// import type { Tag } from "../types/models"

// export default function AdminTags() {
//   const [tags, setTags] = useState<Tag[]>([])
//   const [name, setName] = useState("")

//   const load = async () => {
//     const res = await tagService.getAll()
//     setTags(res)
//   }

//   useEffect(() => {
//     load()
//   }, [])

//   const addTag = async () => {
//     await tagService.create({ name })
//     setName("")
//     load()
//   }

//   const deleteTag = async (id: number) => {
//     await tagService.remove(id)
//     load()
//   }

//   return (
//     <div>
//       <h2>Tags</h2>

//       <div className="form-row">
//         <input value={name} onChange={e => setName(e.target.value)} />
//         <Button onClick={addTag}>Add</Button>
//       </div>

//       {tags.map(t => (
//         <Card key={t.id}>
//           {t.name}
//           <Button onClick={() => deleteTag(t.id)}>Delete</Button>
//         </Card>
//       ))}
//     </div>
//   )
// }
import { useEffect, useState } from "react"
import { tagService } from "../services/tagService"
import ConfirmDialog from "../components/ConfirmDialog"
import SearchInput from "../components/SearchInput"
import type { Tag } from "../types/models"

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState("")
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = async () => {
    const res = await tagService.getAll()
    setTags(res)
  }

  useEffect(() => {
    load()
  }, [])

  const addTag = async () => {
    if (!name.trim()) return
    await tagService.create({ name })
    setName("")
    load()
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    await tagService.remove(deleteId)
    setDeleteId(null)
    load()
  }

  const filtered = tags.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section>
      <h2>Tags</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
        <SearchInput value={search} onChange={setSearch} />
        <input
          placeholder="New tag..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") addTag()
          }}
        />
        <button onClick={addTag}>Add</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {filtered.map(t => (
          <div key={t.id} className="tag-pill">
            {t.name}
            <button
              className="danger"
              onClick={() => setDeleteId(t.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete "${tags.find(t => t.id === deleteId)?.name}"?`}
      />
    </section>
  )
}
import { useEffect, useState } from "react"
import { categoryService } from "../services/categoryService"
import type { Category } from "../types/models"

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<number | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleteMode, setDeleteMode] = useState<"deleteAll" | "moveToRoot" | "moveToOther">("deleteAll")
  const [newParentId, setNewParentId] = useState<number | null>(null)
const [inlineName, setInlineName] = useState("")


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


  const [expandedNodes, setExpandedNodes] = useState<number[]>([])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedNodes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const renderTree = (nodes: Category[], level = 0) => {
    return nodes.map(node => {
      const hasChildren = node.subCategories && node.subCategories.length > 0
      const isExpanded = expandedNodes.includes(node.id)
      const isSelected = selectedNode === node.id

      return (
        <div key={node.id} style={{ marginLeft: level * 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              marginBottom: 4,
              borderRadius: 8,
              background: isSelected ? "#e3f2fd" : "#f5f5f5",
              cursor: "pointer",
              transition: "0.2s"
            }}
            onClick={() => setSelectedNode(node.id)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {hasChildren && (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpand(node.id)
                  }}
                  style={{ marginRight: 6 }}
                >
                  {isExpanded ? "▼" : "▶"}
                </span>
              )}
              <strong>{node.name}</strong>
            </div>

            {isSelected && (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setParentId(node.id)}>➕</button>
                <button onClick={() => handleEdit(node)}>✏️</button>
                <button onClick={() => setDeleteTarget(node)}>🗑</button>
              </div>
            )}
          </div>

          {hasChildren && isExpanded &&
            renderTree(node.subCategories!, level + 1)}
            {parentId === node.id && (
  <div style={{ marginLeft: (level + 1) * 24, marginTop: 6 }}>
    <input
      placeholder="Child name..."
      value={inlineName}
      onChange={e => setInlineName(e.target.value)}
      style={{ padding: 6, borderRadius: 6 }}
    />
    <button
      onClick={async () => {
        if (!inlineName) return

        await categoryService.create({
          id: 0,
          name: inlineName,
          parentCategoryId: node.id
        })

        setInlineName("")
        setParentId(null)
        load()
      }}
    >
      ✔
    </button>

    <button onClick={() => setParentId(null)}>✖</button>
  </div>
)}

        </div>
      )
    })
  }



  const handleEdit = async (cat: Category) => {
    const newName = prompt("New Name", cat.name)
    if (!newName) return

    await categoryService.update(cat.id, {
      name: newName,
      parentCategoryId: cat.parentCategoryId
    })
    load()
  }

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return

    await categoryService.delete(deleteTarget.id, deleteMode, newParentId)
    setDeleteTarget(null)
    load()
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Category</h2>

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

      {renderTree(categories)}

      {deleteTarget && (
        <div className="popup">
          <h3>Delete {deleteTarget.name}</h3>
          {deleteTarget.subCategories && deleteTarget.subCategories.length > 0 && (
            <>
            <p>This category has subcategories. What would you like to do?</p>
          <button onClick={() => setDeleteMode("deleteAll")}>
            Delete Children Too
          </button>

          <button onClick={() => { setDeleteMode("moveToRoot"); setNewParentId(null) }}>
            Move Children To Root
          </button>

          <button onClick={() => setDeleteMode("moveToOther")}>
            Move To Another Parent
          </button>

          {deleteMode === "moveToOther" && (
            <select onChange={e => setNewParentId(Number(e.target.value))}>
              <option value="">Select Parent</option>
              {categories
                .filter(c => c.id !== deleteTarget.id)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          )}
</>
        )}
          <button onClick={handleDeleteConfirmed}>Confirm</button>
          <button onClick={() => setDeleteTarget(null)}>Cancel</button>
        </div>
      )}
    </div>
  )
}

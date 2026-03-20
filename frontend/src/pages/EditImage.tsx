import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import imageService from "../services/imageService"
import { categoryService } from "../services/categoryService"
import { tagService } from "../services/tagService"
import type { Image, Category, Tag } from "../types/models"
import CategorySelect from "../components/CategorySelect"
import TagsSelect from "../components/TagsSelect"

export default function EditImage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [image, setImage] = useState<Image | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [photographers, setPhotographers] = useState<string[]>([])
  const [photographer, setPhotographer] = useState("")



  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const img = await imageService.getById(Number(id))
      const cat = await categoryService.getAll()
      const tg = await tagService.getAll()
      const pht = await imageService.getPhotographers()

      setPhotographer(img.photographer)
      setPhotographers(pht)
      setImage(img)
      setCategories(cat)
      setTags(tg)
      setSelectedTagIds(img.tags?.map(t => t.id) || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

//   const toggleTag = (tagId: number) => {
//     if (selectedTagIds.includes(tagId)) {
//       setSelectedTagIds(prev => prev.filter(id => id !== tagId))
//     } else {
//       setSelectedTagIds(prev => [...prev, tagId])
//     }
//   }

  const handleSave = async () => {
    if (!image) return

    const payload = {
      ...image,
      tagIds: selectedTagIds
    }

    await imageService.update(image.id, payload)
    navigate("/admin") 
  }

  if (loading) return <div>Loading...</div>
  if (!image) return <div>Image not found</div>

  return (
    
    <div className="input-group">

      <img
        src={`http://localhost:5000${image.thumbnailPath}`}
        className="edit-preview"
      />
<aside>

      <label>Title</label>
      <input
        value={image.title}
        onChange={e => setImage({ ...image, title: e.target.value })}
        />

      <label>Description</label>
      <textarea
        value={image.description}
        onChange={e => setImage({ ...image, description: e.target.value })}
        />

      <label>Price (₪)</label>
      <input
        type="number"
        value={image.price}
        onChange={e =>
          setImage({ ...image, price: Number(e.target.value) })
        }
        />

      <label>Category</label>
      <CategorySelect
        categories={categories}
        selectedId={image.categoryId}
        onChange={(id) =>
          setImage({ ...image, categoryId: id })
        }
        />

      <label>Tags</label>
      <TagsSelect tags={tags} selectedIds={selectedTagIds} onChange={setSelectedTagIds} />
      <label>Photographer</label>
      <select
        value={photographer}
        onChange={e => setPhotographer(e.target.value)}
        >
        {photographers.map((p, idx) => (
          <option key={idx} value={p}>
            {p}
          </option>
        ))}
      </select>

      <div className="form-actions">
        <button className="primary-btn" onClick={handleSave}>
          Save Changes
        </button>
        <button
          className="secondary-btn"
          onClick={() => navigate(-1)}
          >
          Cancel
        </button>
      </div>
          </aside>
    </div>
  )
}

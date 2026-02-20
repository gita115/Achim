import { useEffect, useState } from "react"
import { categoryService } from "../services/categoryService"
import { tagService } from "../services/tagService"
import { Button, Card } from "../components/Ui"
import imageService from "../services/imageService"
import type { Category, Image, Tag } from "../types/models"

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [tagId, setTagId] = useState<number | undefined>()

  const loadFilters = async () => {
    const cat = await categoryService.getAll()
    const tg = await tagService.getAll()
    setCategories(cat.data)
    setTags(tg.data)
  }

  const searchImages = async () => {
    const res = await imageService.search({
      search,
      categoryId,
      tagId
    })
    setImages(res)
  }

  useEffect(() => {
    loadFilters()
    searchImages()
  }, [])

  return (
    <div className="container">

      <div className="filters">
        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select onChange={e => setCategoryId(Number(e.target.value))}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select onChange={e => setTagId(Number(e.target.value))}>
          <option value="">All Tags</option>
          {tags.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <Button onClick={searchImages}>Search</Button>
      </div>

      <div className="grid">
        {images.map(img => (

          <Card key={img.id}>
            <div style={{
              opacity: 0.3            }}>
              WATERMARK
            </div>
            <h3>{img.title}</h3>
            <p>{img.price} ₪</p>
          </Card>
        ))}
      </div>

    </div>
  )
}

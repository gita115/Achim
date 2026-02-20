import { useEffect, useState } from "react"
import imageService from "../services/imageService"
import type { Image, Tag } from "../types/models"
import { tagService } from "../services/tagService"

export default function AdminImages() {

  const emptyImage: Image = {
    id: 0,
    title: "",
    description: "",
    categoryId: 0,
    photographer: "",
    year: new Date().getFullYear(),
    filePath: "",
    thumbnailPath: "",
    isActive: true,
    price: 0,
    //tagIds: [],
    tags: []
  }

  const [images, setImages] = useState<Image[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [image, setImage] = useState<Image>(emptyImage)

  useEffect(() => {
    loadImages()
    loadTags()
  }, [])

  const loadImages = async () => {
    const data = await imageService.getAll()
    setImages(data)
  }

  const loadTags = async () => {
    const data = await tagService.getAll()
    setTags(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    setImage(prev => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : value
    }))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(prev => ({
      ...prev,
      isActive: e.target.checked
    }))
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions)
      .map(o => Number(o.value))

    setImage(prev => ({
      ...prev,
      tagIds: selected
    }))
  }
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append("file", selectedFile!)
    formData.append("title", image.title)
    formData.append("description", image.description)
    formData.append("categoryId", String(image.categoryId))
    formData.append("price", String(image.price))
    formData.append("photographer", image.photographer)
    formData.append("year", String(image.year))
    formData.append("isActive", String(image.isActive))

    // image.tagIds.forEach(id => {
    //   formData.append("tagIds", String(id))
    // })

    await imageService.upload(formData)
  }


  return (
    <div>
      <h2>ניהול תמונות</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (!e.target.files?.length) return
            setSelectedFile(e.target.files[0])
          }}
        />


        <input name="title" placeholder="כותרת" value={image.title} onChange={handleChange} />

        <textarea name="description" placeholder="תיאור" value={image.description} onChange={handleChange} />

        <input name="categoryId" type="number" value={image.categoryId} onChange={handleChange} />

        <input name="photographer" placeholder="צלם" value={image.photographer} onChange={handleChange} />

        <input name="year" type="number" value={image.year} onChange={handleChange} />

        <input name="filePath" placeholder="קובץ מלא" value={image.filePath} onChange={handleChange} />

        <input name="thumbnailPath" placeholder="תמונה מוקטנת" value={image.thumbnailPath} onChange={handleChange} />

        <input name="price" type="number" value={image.price} onChange={handleChange} />

        <label>
          פעיל
          <input type="checkbox" checked={image.isActive} onChange={handleCheckbox} />
        </label>

        <label>טאגים:</label>
        <select multiple onChange={handleTagChange}>
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>

        <button type="submit">שמור</button>
      </form>

      <hr />

      <h3>רשימת תמונות</h3>

      {images.map(img => (
        <div key={img.id} >
          <h4>{img.title}</h4>
          <p>{img.description}</p>
          <p>₪{img.price}</p>

          <div>
            {img.tags?.map(t => (
              <span key={t.id}>#{t.name} </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
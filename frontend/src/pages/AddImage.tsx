// import { useEffect, useState } from "react"
// import imageService from "../services/imageService"
// import { tagService } from "../services/tagService"
// import { categoryService } from "../services/categoryService"
// import type { Image, Tag, Category } from "../types/models"

// export default function AdminImages() {

//   const emptyImage: Image = {
//     id: 0,
//     title: "",
//     description: "",
//     categoryId: 0,
//     photographer: "",
//     year: new Date().getFullYear(),
//     filePath: "",
//     thumbnailPath: "",
//     isActive: true,
//     price: 0,
//     tags: []
//   }

//   const [images, setImages] = useState<Image[]>([])
//   const [tags, setTags] = useState<Tag[]>([])
//   const [categories, setCategories] = useState<Category[]>([])
//   const [image, setImage] = useState<Image>(emptyImage)

//   const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [preview, setPreview] = useState<string | null>(null)
//   const [dragging, setDragging] = useState(false)

//   const [tagSearch, setTagSearch] = useState("")
//   const [categorySearch, setCategorySearch] = useState("")

//   useEffect(() => {
//     loadAll()
//   }, [])

//   const loadAll = async () => {
//     setImages(await imageService.getAll())
//     setTags(await tagService.getAll())
//     setCategories(await categoryService.getAll())
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     setDragging(false)
//     const file = e.dataTransfer.files[0]
//     handleFile(file)
//   }

//   const handleFile = (file: File) => {
//     setSelectedFile(file)
//     setPreview(URL.createObjectURL(file))
//   }


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!selectedFile) return alert("בחרי תמונה")

//     const formData = new FormData()

//     formData.append("file", selectedFile)
//     formData.append("title", image.title)
//     formData.append("description", image.description)
//     formData.append("categoryId", String(image.categoryId))
//     formData.append("price", String(image.price))
//     formData.append("photographer", image.photographer)
//     formData.append("year", String(image.year))
//     formData.append("isActive", String(image.isActive))

//     selectedTagIds.forEach(id =>
//       formData.append("tagIds", String(id))
//     )

//     await imageService.upload(formData)

//     setImage(emptyImage)
//     setSelectedTagIds([])
//     setSelectedFile(null)
//     setPreview(null)
//     loadAll()
//   }


//   const handleDelete = async (id: number) => {
//     if (!window.confirm("למחוק תמונה?")) return
//     await imageService.delete(id)
//     loadAll()
//   }

//   const filteredTags = tags.filter(t =>
//     t.name.toLowerCase().includes(tagSearch.toLowerCase())
//   )
// const allCategories = categories.flatMap(cat => [
//   cat,
//   ...(cat.subCategories || [])
// ])

// const filteredCategories = allCategories.filter(c =>
//   c.name.toLowerCase().includes(categorySearch.toLowerCase())
// )


//   return (
//     <div className="container">

//       <div className="card">
//         <h2>ניהול תמונות</h2>

//         <div
//           className={`drop-zone ${dragging ? "dragging" : ""}`}
//           onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
//           onDragLeave={() => setDragging(false)}
//           onDrop={handleDrop}
//           onClick={() => document.getElementById("fileInput")?.click()}
//         >
//           גררי תמונה לכאן או לחצי לבחירה
//           <input
//             id="fileInput"
//             type="file"
//             hidden
//             accept="image/*"
//             onChange={(e) => {
//               if (!e.target.files?.length) return
//               handleFile(e.target.files[0])
//             }}
//           />
//         </div>

//         {preview && <img src={preview} className="preview-img" />}

//         <form className="admin-form" onSubmit={handleSubmit}>

//           <input
//             placeholder="כותרת"
//             value={image.title}
//             onChange={e => setImage({ ...image, title: e.target.value })}
//           />

//           <textarea
//             placeholder="תיאור"
//             value={image.description}
//             onChange={e => setImage({ ...image, description: e.target.value })}
//           />

//           <input
//             className="search-input"
//             placeholder="חיפוש קטגוריה..."
//             value={categorySearch}
//             onChange={e => setCategorySearch(e.target.value)}
//           />

//   <select
//   value={image.categoryId}
//   onChange={e =>
//     setImage({ ...image, categoryId: Number(e.target.value) })
//   }
// >
//   <option value={0}>בחרי קטגוריה</option>

//   {categories.map(parent => (
//     <>
//       <option
//         key={parent.id}
//         value={parent.id}
//         className="parent-option"
//       >
//         {parent.name}
//       </option>

//       {parent.subCategories?.map(sub => (
//         <option
//           key={sub.id}
//           value={sub.id}
//           className="child-option"
//         >
//           └── {sub.name}
//         </option>
//       ))}

//     </>
//   ))}
// </select>


//           <input
//             placeholder="צלם"
//             value={image.photographer}
//             onChange={e => setImage({ ...image, photographer: e.target.value })}
//           />

//           <input
//             type="number"
//             placeholder="שנה"
//             value={image.year}
//             onChange={e => setImage({ ...image, year: Number(e.target.value) })}
//           />

//           <input
//             type="number"
//             placeholder="מחיר"
//             value={image.price}
//             onChange={e => setImage({ ...image, price: Number(e.target.value) })}
//           />

//           <div>
//   <input
//     className="search-input"
//     placeholder="חיפוש תגית..."
//     value={tagSearch}
//     onChange={e => setTagSearch(e.target.value)}
//   />

//   <select
//     multiple
//     size={6}
//     value={selectedTagIds.map(String)}
//     onChange={(e) => {
//       const selected = Array.from(e.target.selectedOptions)
//         .map(o => Number(o.value))
//       setSelectedTagIds(selected)
//     }}
//   >
//     {tags
//       .filter(t =>
//         t.name.toLowerCase().includes(tagSearch.toLowerCase())
//       )
//       .map(tag => (
//         <option key={tag.id} value={tag.id}>
//           {tag.name}
//         </option>
//       ))}
//   </select>
// </div>

//           <button className="btn">העלה תמונה</button>

//         </form>
//       </div>

import { useEffect, useState } from "react"
import imageService from "../services/imageService"
import { tagService } from "../services/tagService"
import { categoryService } from "../services/categoryService"
import type { Image, Tag, Category } from "../types/models"
import { motion, AnimatePresence } from "framer-motion"
import CategorySelect from "../components/CategorySelect"
import TagsSelect from "../components/TagsSelect"
import { useNavigate } from "react-router-dom"
import { em, tr } from "framer-motion/client"
export default function AdminImages() {
  // const emptyImage: Image = {
  //   id: 0,
  //   title: "",
  //   description: "",
  //   categoryId: 0,
  //   photographer: "",
  //   year: new Date().getFullYear(),
  //   filePath: "",
  //   thumbnailPath: "",
  //   isActive: true,
  //   price: 0,
  //   tags: []
  // }

  const [images, setImages] = useState<Image[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  // const [image, setImage] = useState<Image>(emptyImage)
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [photographers, setPhotographers] = useState<string[]>([])
  const [flag, setFlag] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const navigate = useNavigate()
const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("admin_form_temp")
    return saved ? JSON.parse(saved) : { 
    title: "",
    description: "",
    categoryId: 0,
    photographer: "",
    year: new Date().getFullYear(),
    isActive: true,
    price: 0,
    tags: []
 }
  })

  useEffect(() => {
    // loadImages()
    loadCategories()
    loadTags()
    loadPhotographers()
  }, [])
useEffect(() => {
    localStorage.setItem("admin_form_temp", JSON.stringify(formData))
  }, [formData])
useEffect(() => {
  // פונקציית ניקוי (Cleanup)
  return () => {
    previews.forEach(url => URL.revokeObjectURL(url))
  }
}, [previews])
  // const loadImages = async () => setImages(await imageService.getAll())
  const loadCategories = async () => setCategories(await categoryService.getAll())
  const loadTags = async () => setTags(await tagService.getAll())
  const loadPhotographers = async () => setPhotographers(await imageService.getPhotographers())

  // const handleChange = (e:any) => {
  //   const { name, value, type, checked } = e.target
  //   setFormData((prev: any) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
  //   }))
  
  // }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  
  let finalValue: any = value;

  // טיפול בתיבת סימון (Checkbox) - מחזיר true/false ולא מחרוזת
  if (type === "checkbox") {
    finalValue = (e.target as HTMLInputElement).checked;
  } 
  // המרה למספר עבור שדות נומריים (כמו מחיר, שנה, קטגוריה)
  else if (type === "number" || name === "categoryId") {
    finalValue = value === "" ? 0 : Number(value);
  }

  setFormData((prev: any) => ({
    ...prev,
    [name]: finalValue
  }));
};
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(filesArray)
      setPreviews(filesArray.map(file => URL.createObjectURL(file)))
    }
  }

  // const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => setImage(prev => ({ ...prev, isActive: e.target.checked }))
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFiles) return alert("בחר קובץ")
    const data = new FormData()
    selectedFiles.forEach(file => data.append("files", file))
    // formData.append("file", selectedFile)
    data.append("title", formData.title)
    data.append("description", formData.description)
    data.append("categoryId", formData.categoryId!=0 ? String(formData.categoryId) : categories[0]?.id.toString())
    data.append("price", String(formData.price))
    data.append("photographer", formData.photographer || photographers[0])
    data.append("year", String(formData.year))
    data.append("isActive", formData.isActive)
    selectedTagIds.forEach(id => data.append("tagIds", String(id)))
    // await imageService.upload(formData)
    await imageService.bulkUpload(data)
    localStorage.removeItem("admin_form_temp")
    // loadImages()
    // setImage(emptyImage)
    // setSelectedFile(null)
    // setSelectedTagIds([])    
    navigate("/admin/gallery")
  }

  // const openEditModal = (img: Image) => { setEditingImage(img); setEditModalOpen(true) }
  // const closeEditModal = () => { setEditingImage(null); setEditModalOpen(false) }
  // const deleteImage = async (id: number) => { if (confirm("בטוחה שאת רוצה למחוק?")) { await imageService.delete(id); loadImages() } }

  return (
    <div className="container">
<form onSubmit={handleSubmit}>
       <div className="upload-files">
          <input 
    type="file" 
    multiple 
// {...{ webkitdirectory: "", directory: "" } as any}    
// directory="" 
    onChange={handleFileChange} 
    className="upload-zone__input"
    id="file-upload"
  />
   {/* <label htmlFor="file-upload" className="upload-zone__label">
  //   <div className="upload-zone__icon">📁</div>
  //   <span>גרור תיקייה לכאן או לחץ לבחירת קבצים</span>
  // </label>*/}
  <div className="previews-grid">
    {previews.map((url, i) => (
      <div key={i} className="preview-item">
         <img src={url} alt="preview" style={{height:'30px',width:'auto'}}/>
      </div>
    ))}
  </div> 
        </div>
        {/* <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && setSelectedFile(e.target.files[0])} /> */}
        <input name="title" placeholder="כותרת" value={formData.title} onChange={handleChange} />
        <textarea name="description" placeholder="תיאור" value={formData.description} onChange={handleChange} />
        <CategorySelect categories={categories} selectedId={formData.categoryId} onChange={id => setFormData({ ...formData, categoryId: id })} />
        
          <select name="photographer" value={formData.photographer} onChange={e => {setFormData({ ...formData, photographer: e.target.value })
          if(e.target.value === "other") setFlag(true)
          }}
          >
            {/* <option value="">בחר צלם</option> */}
            {photographers.map(p => (
              <option key={p} value={p}>צלמ/ת : {p}</option>
            ))}
            <option value="other">צלמ/ת אחר</option>
          </select>
          {flag && (
            <input 
              placeholder="שם צלמ/ת חדש/ה" 
              value={formData.photographer} 
              onChange={e => setFormData({ ...formData, photographer: e.target.value })}
            />
          )}
        
        <input name="year" type="number" placeholder="שנה" value={formData.year} onChange={handleChange} />
        <input name="price" type="number" placeholder="מחיר" value={formData.price} onChange={handleChange} />
        <label className="checkbox">פעיל <input type="checkbox" checked={formData.isActive} onChange={handleChange} /></label>
        <TagsSelect tags={tags} selectedIds={selectedTagIds} onChange={setSelectedTagIds} />
        <button type="submit" className="primary-btn">העלה {selectedFiles.length} תמונות למערכת</button>
      </form>

        {/* 
      <div className="grid">
        {images.map(img => (
          <div key={img.id} className="image-card">
            <div className="image-wrapper">
              <img src={`http://localhost:5000${img.thumbnailPath}`} style={{width:'50px'}} alt={img.title} onClick={() => window.open(img.filePath, "_blank")} />
            </div>
            <h4>{img.title}</h4>
            <p>{categories.find(c => c.id === img.categoryId)?.name}</p>
            <p>{tags.map(t => t.name).join(", ")}</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => openEditModal(img)} className="secondary-btn">✏</button>
              <button onClick={() => deleteImage(img.id)} className="secondary-btn">🗑</button>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {editModalOpen && editingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex", justifyContent: "center", alignItems: "center",
              zIndex: 1000
            }}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="drawer open">
              <div className="drawer-content">
                <h3>עריכת תמונה</h3>
                <p>ניתן לשלב כאן את אותה Form עם ערכי editingImage</p>
                <button onClick={closeEditModal} className="primary-btn">סגור</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

    </div>
  )
}
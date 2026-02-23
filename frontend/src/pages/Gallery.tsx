// // import { useEffect, useState } from "react"
// // import imageService from "../services/imageService"
// // import { categoryService } from "../services/categoryService"
// // import { tagService } from "../services/tagService"
// // import { useCart } from "../context/CartContext"
// // import CartDrawer from "../components/CartDrawer"

// // export default function Gallery() {
// //   const [images, setImages] = useState<any[]>([])
// //   const [categories, setCategories] = useState<any[]>([])
// //   const [tags, setTags] = useState<any[]>([])
// //   const [search, setSearch] = useState("")
// //   const [categoryId, setCategoryId] = useState<number | undefined>()
// //   const [tagId, setTagId] = useState<number | undefined>()
// //   const [drawerOpen, setDrawerOpen] = useState(false)
// //   const [purchasedIds, setPurchasedIds] = useState<number[]>([])

// //   const { addToCart, removeFromCart, isInCart, items } = useCart()

// //   const load = async () => {
// //     const imgs = await imageService.search({ search, categoryId, tagId })
// //     setImages(imgs)

// //     const cat = await categoryService.getAll()
// //     const tg = await tagService.getAll()
// //     setCategories(cat)
// //     setTags(tg)

// //     const purchases = await fetch("http://localhost:5000/api/purchases")
// //     const data = await purchases.json()
// //     setPurchasedIds(data.map((p: any) => p.imageId))
// //   }

// //   useEffect(() => {
// //     load()
// //   }, [])

// //   const resetFilters = () => {
// //     setSearch("")
// //     setCategoryId(undefined)
// //     setTagId(undefined)
// //     load()
// //   }

// //   const handleKeyPress = (e: any) => {
// //     if (e.key === "Enter") load()
// //   }

// //   const toggleCart = (img: any) => {
// //     if (isInCart(img.id)) removeFromCart(img.id)
// //     else addToCart(img)
// //   }

// //   return (
// //     <div className="container">
// //       <header className="topbar">
// //   <input
// //     value={search}
// //     onChange={e => setSearch(e.target.value)}
// //     onKeyDown={e => e.key === "Enter" && load()}
// //     placeholder="Search..."
// //   />
// //   <select value={categoryId ?? ""} onChange={e => setCategoryId(Number(e.target.value) || undefined)}>
// //     <option value="">All Categories</option>
// //     {categories.map(c => (
// //       <option key={c.id} value={c.id}>{c.name}</option>
// //     ))}
// //   </select>
// //   <select value={tagId ?? ""} onChange={e => setTagId(Number(e.target.value) || undefined)}>
// //     <option value="">All Tags</option>
// //     {tags.map(t => (
// //       <option key={t.id} value={t.id}>{t.name}</option>
// //     ))}
// //   </select>
// //   <button className="primary-btn" onClick={load}>Search</button>
// //   <button className="secondary-btn" onClick={resetFilters}>Reset</button>
// //   <button className="primary-btn" onClick={() => setDrawerOpen(true)}>🛒 Cart ({items.length})</button>
// // </header>


// //       <div className="filters">
// //         <input
// //           value={search}
// //           onChange={e => setSearch(e.target.value)}
// //           onKeyDown={handleKeyPress}
// //           placeholder="Search..."
// //         />

// //         <select value={categoryId ?? ""} onChange={e => setCategoryId(Number(e.target.value) || undefined)}>
// //           <option value="">All Categories</option>
// //           {categories.map((c: any) => (
// //             <option key={c.id} value={c.id}>{c.name}</option>
// //           ))}
// //         </select>

// //         <select value={tagId ?? ""} onChange={e => setTagId(Number(e.target.value) || undefined)}>
// //           <option value="">All Tags</option>
// //           {tags.map((t: any) => (
// //             <option key={t.id} value={t.id}>{t.name}</option>
// //           ))}
// //         </select>

// //         <button onClick={load} className="primary-btn">Search</button>
// //         <button onClick={resetFilters} className="secondary-btn">Reset</button>
// //       </div>

// //       <div className="grid">
// //         {images.map(img => {
// //           const purchased = purchasedIds.includes(img.id)
// //           const inCart = isInCart(img.id)

// //           return (
// //             <div key={img.id} className="image-card">
// //               <div className="image-wrapper">
// //                 <img src={`http://localhost:5000${img.thumbnailPath}`} />
// //                 {!purchased && <div className="watermark">PREVIEW</div>}
// //                 {purchased && <div className="purchased-badge">Purchased</div>}
// //               </div>

// //               <h3>{img.title}</h3>
// //               <p>{img.price} ₪</p>

// //               {!purchased && (
// //                 <button
// //                   className={inCart ? "added-btn" : "primary-btn"}
// //                   onClick={() => toggleCart(img)}
// //                 >
// //                   {inCart ? "Added ✔" : "Add to Cart"}
// //                 </button>
// //               )}
// //             </div>
// //           )
// //         })}
// //       </div>

// //       <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
// //     </div>
// //   )
// // }
import { useEffect, useState } from "react"
import { categoryService } from "../services/categoryService"
import { tagService } from "../services/tagService"
import imageService from "../services/imageService"
import type { Category, Image, Tag } from "../types/models"
import { useNavigate } from "react-router"
import { div } from "framer-motion/m"
import GalleryCard from "../components/GalleryCard"
import CategorySelect from "../components/CategorySelect"
import TagsSelect from "../components/TagsSelect"
type Props = {
  isAdmin?: boolean
}
export default function Gallery({ isAdmin = false }: Props) {
  const [images, setImages] = useState<Image[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [tagId, setTagId] = useState<number | undefined>()

  const [cart, setCart] = useState<Image[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [purchased, setPurchased] = useState<number[]>([])
  const [editingImage, setEditingImage] = useState<Image | null>(null)
  useEffect(() => {
    loadFilters()
    loadImages()
    const storedCart = localStorage.getItem("cart")
    if (storedCart) setCart(JSON.parse(storedCart))
    const storedPurchased = localStorage.getItem("purchased")
    if (storedPurchased) setPurchased(JSON.parse(storedPurchased))
  }, [])

  const loadFilters = async () => {
    const cat = await categoryService.getAll()
    const tg = await tagService.getAll()
    setCategories(cat.data)
    setTags(tg.data)
  }

  const loadImages = async () => {
    const res = await imageService.search({
      search,
      categoryId,
      tagId
    })
    setImages(res)
  }

  const resetFilters = () => {
    setSearch("")
    setCategoryId(undefined)
    setTagId(undefined)
    loadImages()
  }

  const toggleCart = (img: Image) => {
    const exists = cart.find(i => i.id === img.id)
    let newCart: Image[]
    if (exists) {
      newCart = cart.filter(i => i.id !== img.id)
    } else {
      newCart = [...cart, img]
    }
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const handleCheckoutSuccess = () => {
    const ids = cart.map(i => i.id)
    setPurchased([...purchased, ...ids])
    localStorage.setItem("purchased", JSON.stringify([...purchased, ...ids]))
    setCart([])
    localStorage.setItem("cart", JSON.stringify([]))
    setCheckoutOpen(false)
  }



  const handleDownload = (img: Image) => {
    if (!purchased.includes(img.id)) {
      alert("Please purchase first")
      return
    }
    const a = document.createElement("a")
    a.href = img.filePath
    a.download = img.title + ".jpg"
    a.click()
  }

  const handleDelete = async (id: number) => {
    await imageService.delete(id)
    loadImages()
  }
  const isInCart = (img: Image) => cart.find(i => i.id === img.id)

  return (
    <div className="container">
      <div className="topbar">
        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && loadImages()}
        />
        <select value={categoryId ?? ""} onChange={e => setCategoryId(Number(e.target.value) || undefined)}>
          <option value="">All Categories</option>
          {categories?.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {/* <CategorySelect categories={categories} selectedId={categoryId??undefined} onChange={id => setCategoryId(id)} />
        <TagsSelect tags={tags} selectedIds={selectedTagIds} onChange={setSelectedTagIds} /> */}

        <select value={tagId ?? ""} onChange={e => setTagId(Number(e.target.value) || undefined)}>
          <option value="">All Tags</option>
          {tags?.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <button className="primary-btn" onClick={loadImages}>Search</button>
        <button className="secondary-btn" onClick={resetFilters}>Reset</button>
        {!isAdmin && (
          <button className="primary-btn" onClick={() => setDrawerOpen(true)}>🛒 Cart ({cart.length})</button>
        )}
      </div>
      {!isAdmin && (
        <div className={`drawer ${drawerOpen ? "open" : ""}`}>
          <div className="drawer-content">
            <h2>Cart</h2>
            {cart?.map(i => (
              <div className="cart-row" key={i.id}>
                <img src={`http://localhost:5000${i.thumbnailPath}`} className="cart-thumb" />
                <div className="cart-info">
                  <span>{i.title}</span>
                  <span>{i.price} ₪</span>
                </div>
                <button className="secondary-btn" onClick={() => toggleCart(i)}>Remove</button>
              </div>
            ))}
            <h3>Total: {cart.reduce((sum, i) => sum + i.price, 0)} ₪</h3>
            <button className="primary-btn" onClick={() => navigate("/checkout")}>Checkout</button>
            <button className="secondary-btn" onClick={() => setDrawerOpen(false)}>Close</button>
          </div>
        </div>
      )}
      {/* <div className="grid">
        {images?.map(img=>(
          <div className="image-card" key={img.id}>
            <div className="image-wrapper">
              <img src={`http://localhost:5000${img.thumbnailPath}`} alt={img.title} />
              {!purchased.includes(img.id) && <div className="watermark">WATERMARK</div>}
              {purchased.includes(img.id) && <div className="purchased-badge">Purchased</div>}
            </div>
            <h3>{img.title}</h3>
            <p>{img.price} ₪</p>
            <button 
              className={isInCart(img) ? "added-btn" : "primary-btn"} 
              onClick={()=>toggleCart(img)}>
              {isInCart(img) ? "Added" : "Add to Cart"}
            </button>
            {purchased.includes(img.id) && <button className="primary-btn" onClick={()=>handleDownload(img)}>Download</button>}
          </div>
        ))}
      </div> */}
      <div className="grid">
        {images.map(img => (
          <GalleryCard
            key={img.id}
            image={img}
            isAdmin={isAdmin}
            onEdit={setEditingImage}
            onDelete={handleDelete}
            cart={cart}
            onToggleCart={toggleCart}
          />
        ))}
      </div>

      {/* <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-content">
          <h2>Cart</h2>
          {cart?.map(i => (
            <div className="cart-row" key={i.id}>
              <img src={`http://localhost:5000${i.thumbnailPath}`} className="cart-thumb" />
              <div className="cart-info">
                <span>{i.title}</span>
                <span>{i.price} ₪</span>
              </div>
              <button className="secondary-btn" onClick={() => toggleCart(i)}>Remove</button>
            </div>
          ))}
          <h3>Total: {cart.reduce((sum, i) => sum + i.price, 0)} ₪</h3>
          <button className="primary-btn" onClick={() => navigate("/checkout")}>Checkout</button>
          <button className="secondary-btn" onClick={() => setDrawerOpen(false)}>Close</button>
        </div>
        </div> */}
      </div>
  )
}

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
import { useEffect, useMemo, useState } from "react"
import { categoryService } from "../services/categoryService"
import { tagService } from "../services/tagService"
import imageService from "../services/imageService"
import type { Category, Image, Tag } from "../types/models"
import { useNavigate } from "react-router"
import GalleryCard from "../components/GalleryCard"
import CategorySelect from "../components/CategorySelect"
import CartDrawer from "../components/CartDrawer"
import { useCart } from "../context/CartContext"
//-----
type Props = {
  isAdmin?: boolean
}
//-----
export default function Gallery({ isAdmin = false }: Props) {
  const [images, setImages] = useState<Image[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [photographers, setPhotographers] = useState<string[]>([])

  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number>()
  const [photographer, setPhotographer] = useState("")
  const [showInactive, setShowInactive] = useState(false)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 20

  //-----
  const [tags, setTags] = useState<Tag[]>([])
  const navigate = useNavigate()
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const { items: cart, addToCart, removeFromCart, isInCart } = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  //-----
  useEffect(() => {
    loadFilters()
    loadPhotographers()
    loadImages()
  }, [])
  useEffect(() => {
    //-----
    // setHasMore(true)
    // setImages([])
    // setPage(1)
    //-----
    loadImages(true)
  }, [search, categoryId, photographer, showInactive])

useEffect(() => {
  const handleScroll = () => {
    const isBottom = window.innerHeight + document.documentElement.scrollTop + 100 
                     >= document.documentElement.offsetHeight;

    if (isBottom && hasMore) {
      loadImages(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [hasMore, page]); // הוסיפי את page ל-dependencies כדי שהפונקציה תכיר את הדף המעודכן
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + document.documentElement.scrollTop + 100 >=
  //       document.documentElement.offsetHeight &&
  //       hasMore
  //     ) {
  //       loadImages(true)
  //     }
  //   }

  //   window.addEventListener("scroll", handleScroll)
  //   return () => window.removeEventListener("scroll", handleScroll)
  // }, [hasMore])

  const loadFilters = async () => {
    const cat = await categoryService.getAll()
    const tg = await tagService.getAll()
    setCategories(cat)
    setTags(tg)
  }
  const loadPhotographers = async () => {
    const res = await imageService.getPhotographers()
    setPhotographers(res)
  }
  const loadImages = async (reset = false) => {
    const currentPage = reset ? 1 : page
    const params: any = {
      search,
      photographer,
      includeInactive: isAdmin && showInactive,
      page: currentPage,
      pageSize
    }

    // if (search.trim()) params.search = search
    if (categoryId && categoryId > 0) params.categoryId = categoryId.toString()
    // if (photographer) params.photographer = photographer
    // if (selectedTagIds.length > 0) params.tagIds = selectedTagIds.join(",")
    // params.page = currentPage.toString();
    // params.pageSize = pageSize.toString();
    // const queryString = new URLSearchParams(params).toString();

    // try {
    //   const res = await imageService.search(queryString);

    //   if (reset) {
    //     setImages(res.data)
    //     setPage(2)
    //   } else {
    //     setImages(prev => [...prev, ...res.data])
    //     setPage(prev => prev + 1)
    //   }

    //   setTotalCount(res.total || 0);
    //   setHasMore(res.data.length === pageSize);
    // } catch (err) {
    //   console.log("Failed to load images:", err);
    // }
  
try {
      const res = await imageService.search(new URLSearchParams(params).toString())
      if (reset) {
        setImages(res.data)
        setPage(2)
      } else {
        setImages(prev => [...prev, ...res.data])
        setPage(prev => prev + 1)
      }
      setHasMore(res.data.length === pageSize)
    } catch (err) {
      console.error("שגיאה בטעינת תמונות", err)
    }
  }

  const toggleCart = (img: Image) => {
    if (isInCart(img.id)) removeFromCart(img.id)
    else addToCart(img)
  }

  const handleDelete = async (id: number) => {
    await imageService.delete(id)
    await loadImages(true)
  }
  // const isInCart = (img: Image) => cart.find(i => i.id === img.id)

  return (
<div className="gallery-container">
      {/* Search Bar - Sticky */}
      <div className="sticky-header">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="חיפוש" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <CategorySelect categories={categories} selectedId={categoryId ?? 0} onChange={setCategoryId} />

          <select value={photographer} onChange={e => setPhotographer(e.target.value)}>
            <option value="">כל הצלמים</option>
            {photographers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          
          {isAdmin && (
            <div className="admin-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={showInactive} 
                  onChange={e => setShowInactive(e.target.checked)} 
                />
                הצג לא פעילים
              </label>
            </div>
          )}
        </div>
      </div>
    {/* <div className="container">
      <div className="topbar">

        <div className="input-group">
          <input
            placeholder="Search images..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <CategorySelect categories={categories} selectedId={categoryId ?? 0} onChange={setCategoryId} />
          <select
            value={photographer}
            onChange={e => setPhotographer(e.target.value)}
          >
            <option value="">All Photographers</option>
            {photographers.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select> */}

          {!isAdmin && (
            <button onClick={() => setDrawerOpen(true)}>🛒 Cart ({cart.length})</button>
          )}
        {/* </div> */}

      {/* </div> */}
      {!isAdmin && (
        <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}

      <div className="grid">

        {images && (
          <>
            {/* {isAdmin && (
              <div className="gallery-navbar">
                <button
                  className={categoryId !== -1 ? "active" : ""}
                  onClick={() => setCategoryId(-1)}
                >
                  Active
                </button>
                <button
                  className={categoryId === -1 ? "active" : ""}
                  onClick={() => setCategoryId(undefined)}
                >
                  Inactive
                </button>
              </div>)} */}
            {!showInactive ? (
              <>
                {images.filter(img => img.isActive).map(img => (
                  <GalleryCard
                    key={img.id}
                    image={img}
                    isAdmin={isAdmin}
                    onEdit={image => navigate(`/admin/images/edit/${image.id}`)}
                    onDelete={handleDelete}
                    cart={cart}
                    onToggleCart={toggleCart}
                    onToggleActive={async (image) => {
                      await imageService.update(image.id, { ...image, isActive: !image.isActive })
                      await loadImages(true)
                    }}
                  />
                ))}
              </>
            ) : (
              <>
                {images.filter(img => !img.isActive).map(img => (
                  <GalleryCard
                    key={img.id}
                    image={img}
                    isAdmin={isAdmin}
                    onEdit={image => navigate(`/admin/images/edit/${image.id}`)}
                    onDelete={handleDelete}
                    cart={cart}
                    onToggleCart={toggleCart}
                    onToggleActive={async (image) => {
                      await imageService.update(image.id, { ...image, isActive: !image.isActive })
                      await loadImages(true)
                    }}
                  />
                ))}

              </>
            )}
          </>
        )}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(totalCount / pageSize) })
          .map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
      </div>

    </div>
  )
}

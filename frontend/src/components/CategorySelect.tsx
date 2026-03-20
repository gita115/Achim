// import { useState, useMemo, useRef, useEffect } from "react"
// import type { Category } from "../types/models"

// interface Props {
//   categories: Category[]
//   selectedId: number
//   onChange: (id: number) => void
// }

// export default function CategorySelect({ categories, selectedId, onChange }: Props) {
//   const [search, setSearch] = useState("")
//   const [open, setOpen] = useState(false)
//   const containerRef = useRef<HTMLDivElement>(null)

//   const filteredCategories = useMemo(() => {
//     if (!categories) return []
//     return categories
//       .map(cat => ({
//         ...cat,
//         subCategories: cat.subCategories?.filter(sub =>
//           sub.name.toLowerCase().includes(search.toLowerCase())
//         )
//       }))
//       .filter(cat =>
//         cat.name.toLowerCase().includes(search.toLowerCase()) ||
//         (cat.subCategories && cat.subCategories.length > 0)
//       )
//   }, [categories, search])

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   const getLabel = (id: number) => {
//     const parent = categories.find(c => c.id === id)
//     if (parent) return parent.name
//     for (const c of categories) {
//       const sub = c.subCategories?.find(s => s.id === id)
//       if (sub) return sub.name
//     }
//     return "כל הקטגוריות"
//   }

//   return (
//     <div ref={containerRef} className="category-select">
//   <button
//     type="button"
//     onClick={() => setOpen(prev => !prev)}
//     className="category-select__trigger"
//   >
//     <span>{getLabel(selectedId)}</span>
//     <span className={`arrow ${open ? "open" : ""}`}>▾</span>
//   </button>

//   {open && (
//     <div className="category-select__dropdown">
//       <input
//         type="text"
//         value={search}
//         onChange={e => setSearch(e.target.value)}
//         placeholder="חיפוש קטגוריה..."
//         className="category-select__search"
//       />

//       <div className="category-select__list">
//         <div onClick={() => { onChange(0); setOpen(false); setSearch("") }}
//                   className="px-3 py-1 cursor-pointer font-bold hover:bg-gray-100">כל הקטגוריות</div>

//             {filteredCategories.map(parent => (
//               <div key={parent.id} className="py-1">
//                 <div
//                   onClick={() => { onChange(parent.id); setOpen(false); setSearch("") }}
//                   className="px-3 py-1 cursor-pointer font-bold hover:bg-gray-100"
//                 >
//                   {parent.name}
//                 </div>
//                 {parent.subCategories?.map(sub => (
//                   <div
//                     key={sub.id}
//                     onClick={() => { onChange(sub.id); setOpen(false); setSearch("") }}
//                     className="px-6 py-1 cursor-pointer hover:bg-gray-100"
//                   >
//                     └── {sub.name}
//                   </div>
//                 ))}
//               </div>
//             ))}
//             {filteredCategories.length === 0 && (
//               <div className="px-3 py-2 text-gray-400">לא נמצאו קטגוריות</div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
import { useState, useMemo, useRef, useEffect } from "react"
import type { Category } from "../types/models"

interface Props {
  categories: Category[]
  selectedId: number
  onChange: (id: number) => void
}

export default function CategorySelect({ categories, selectedId, onChange }: Props) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredCategories = useMemo(() => {
    if (!categories) return []
    const term = search.toLowerCase()
    
    return categories.reduce((acc: Category[], cat) => {
      const isParentMatch = cat.name.toLowerCase().includes(term)
      const matchingSubs = cat.subCategories?.filter(sub => 
        sub.name.toLowerCase().includes(term)
      ) || []

      // אם האבא מתאים או שיש בנים שמתאימים - נציג את הענף
      if (isParentMatch || matchingSubs.length > 0) {
        acc.push({
          ...cat,
          subCategories: isParentMatch ? cat.subCategories : matchingSubs
        })
      }
      return acc;
    }, [])
  }, [categories, search])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const currentLabel = useMemo(() => {
    if (selectedId === 0) return "כל הקטגוריות"
    for (const cat of categories) {
      if (cat.id === selectedId) return cat.name
      const sub = cat.subCategories?.find(s => s.id === selectedId)
      if (sub) return sub.name
    }
    return "בחר קטגוריה"
  }, [selectedId, categories])

  return (
    <div ref={containerRef} className="category-select">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="category-select__trigger"
      >
        <span>{currentLabel}</span>
        <span className={`arrow ${isOpen ? "open" : ""}`}>▾</span>
      </button>

      {isOpen && (
        <div className="category-select__dropdown">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חפש קטגוריה..."
            className="category-select__search"
            autoFocus
          />

          <div className="category-select__list">
            <div 
              onClick={() => { onChange(0); setIsOpen(false); setSearch("") }}
              className="category-select__item font-bold border-b"
            >
              כל הקטגוריות
            </div>

              {filteredCategories.map(parent => (
  <div key={parent.id} className="category-group">
    <div
      onClick={() => { onChange(parent.id); setIsOpen(false); setSearch("") }}
      className={`category-select__item parent ${selectedId === parent.id ? "active" : ""}`}
      style={{ fontWeight: 'bold', cursor: 'pointer', padding: '8px 12px' }}
    >
      {parent.name}
    </div>
    {parent.subCategories?.map(sub => (
      <div
        key={sub.id}
        onClick={() => { onChange(sub.id); setIsOpen(false); setSearch("") }}
        className={`category-select__item child ${selectedId === sub.id ? "active" : ""}`}
        style={{ paddingRight: '25px', cursor: 'pointer', color: '#555' }}
      >
        <span style={{ color: '#ccc', marginLeft: '5px' }}>──┘</span>
        {sub.name}
      </div>
    ))}
  </div>
))}
            {filteredCategories.length === 0 && (
              <div className="category-select__no-results">לא נמצאו תוצאות</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
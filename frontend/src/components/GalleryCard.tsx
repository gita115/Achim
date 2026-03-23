import { useNavigate } from "react-router-dom"
import type { Image } from "../types/models"
import { useState } from "react"

type Props = {
  image: Image
  isAdmin?: boolean
  onEdit?: (image: Image) => void
  onDelete?: (id: number) => void
  cart?: Image[]
  onToggleCart?: (img: Image) => void
  onToggleActive?: (img: Image) => void
}

export default function GalleryCard({
  image,
  isAdmin = false,
  onEdit,
  onDelete,
  cart = [],
  onToggleCart,
  onToggleActive
}: Props) {

  const isInCart = () => cart.find(i => i.id === image.id)
  const navigate = useNavigate()

  return (
    <div className="image-card">

      <div className="image-wrapper">
        <img
          src={`http://localhost:5000${image.thumbnailPath}`}
          alt={image.title}
          style={{ height: 220, objectFit: "cover" }}
        />
        {/* Example watermark */}
        {/* {!isAdmin && !purchased.includes(image.id) && <div className="watermark">WATERMARK</div>} */}
        {/* Purchased badge */}
        {/* {purchased.includes(image.id) && <div className="purchased-badge">Purchased</div>} */}
      </div>

      <h4>{image.title}</h4>
      <p>{image.price} ₪</p>

      {isAdmin ? (
        <div style={{ display: "flex", gap: 8 }}>
          <button className="secondary-btn" onClick={() => {onEdit?.(image); navigate(`/admin/images/edit/${image.id}`)}
}>
            Edit
          </button>
          <button className="primary-btn" onClick={() => onDelete?.(image.id)}>
            Delete
          </button>
         <label className="checkbox">{image.isActive?"":"Not " }Active <input type="checkbox" checked={image.isActive} onChange={() => onToggleActive?.(image)}/></label>
        </div>
      ) : (
        <button
          className={isInCart() ? "added-btn" : "primary-btn"}
          onClick={() => onToggleCart?.(image)}
        >
          {isInCart() ? "Added" : "Add to Cart"}
        </button>
      )}

    </div>
  )
}

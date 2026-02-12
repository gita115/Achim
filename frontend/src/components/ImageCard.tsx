import type { Image } from '../types/models'

interface Props { image: Image }

export default function ImageCard({ image }: Props) {
  return (
    <div className='border rounded p-2 shadow'>
      <img src={image.thumbnailPath} alt={image.title} className='w-full h-40 object-cover rounded' />
      <h3 className='text-sm font-bold mt-2'>{image.title}</h3>
      <p className='text-xs text-gray-500'>{image.photographer} - {image.year}</p>
      <p className='text-xs text-green-600'>{image.price} ₪</p>
    </div>
  )
}

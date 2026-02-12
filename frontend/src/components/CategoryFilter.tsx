import type { Category } from '../types/models'

interface Props {
  categories: Category[]
  selected?: number
  onChange?: (id?: number) => void
}

export default function CategoryFilter({ categories, selected, onChange }: Props) {
  return (
    <select
      className='border rounded p-1'
      value={selected ?? ''}
      onChange={e => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
    >
      <option value=''>All</option>
      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
    </select>
  )
}

interface Props {
  title: string
  value: number | string
}

export default function StatsCard({ title, value }: Props) {
  return (
    <div className='border rounded p-4 shadow text-center'>
      <h4 className='text-sm text-gray-500'>{title}</h4>
      <p className='text-xl font-bold'>{value}</p>
    </div>
  )
}

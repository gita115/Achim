import StatsCard from '../components/StatsCard'

export default function AdminDashboard() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: 20 }}>
        <StatsCard title="Total Users" value="52" />
        <StatsCard title="Total Images" value="180" />
        <StatsCard title="Downloads" value="1240" />
      </div>
    </div>
  )
}

// import { Link } from "react-router-dom"

// export default function AdminDashboard() {
//   return (
//     <div style={{ padding: 40 }}>
//       <h1>Admin Panel</h1>

//       <div style={{ display: "flex", gap: 20 }}>
//         <Link to="/admin/images">Manage Images</Link>
//         <Link to="/admin/categories">Manage Categories</Link>
//         <Link to="/admin/tags">Manage Tags</Link>
//         <Link to="/admin/purchases">View Purchases</Link>
//       </div>
//     </div>
//   )
// }
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { purchaseService } from "../services/purchaseService"
export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    purchaseService.getStats().then(setStats);
  }, []);

  if (!stats) return <div>טוען נתונים...</div>;

  return (
    <div className="dashboard-container" dir="rtl">

      {/* כרטיסי מידע מהיר */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>סך תמונות</h3>
          <p className="stat-number">{stats.totalImages}</p>
        </div>
        <div className="stat-card primary">
          <h3>סה"כ הכנסות</h3>
          <p className="stat-number">₪{stats.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="stat-card success">
          <h3>רכישות שבוצעו</h3>
          <p className="stat-number">{stats.totalPurchases}</p>
        </div>
        <div className="stat-card">
          <h3>תמונות פעילות</h3>
          <p className="stat-number">{stats.activeImages}</p>
        </div>
      </div>

      {/* גרף מכירות חודשי */}
      <div className="chart-section">
        <h3>מגמת מכירות (6 חודשים אחרונים)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={stats.salesHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#007bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
export default function StatCard({ label, value, icon: Icon, tone="purple", sub }) {
  return <div className="stat-card">
    <div className={`stat-icon ${tone}`}><Icon size={21}/></div>
    <div className="stat-copy"><span>{label}</span><strong>{value}</strong>{sub && <small>{sub}</small>}</div>
  </div>;
}

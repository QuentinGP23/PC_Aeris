import './Dashboard.scss'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Package, ComputerTower, Cpu, Monitor, Memory, HardDrive, Lightning, Cube, Wind } from '@phosphor-icons/react'
import { adminService, type DashboardStats } from '../../services'
import { Spinner, Alert, Card } from '../../components/common'
import './Dashboard.scss'

const CATEGORY_META: Record<string, { label: string; icon: typeof Users; color: string }> = {
  cpu:         { label: 'Processeurs',      icon: Cpu,          color: '#6366f1' },
  gpu:         { label: 'Cartes graphiques', icon: Monitor,      color: '#8b5cf6' },
  ram:         { label: 'RAM',              icon: Memory,       color: '#3b82f6' },
  motherboard: { label: 'Cartes mères',     icon: ComputerTower,color: '#0ea5e9' },
  storage:     { label: 'Stockage',         icon: HardDrive,    color: '#10b981' },
  psu:         { label: 'Alimentations',    icon: Lightning,    color: '#f59e0b' },
  pc_case:     { label: 'Boîtiers',         icon: Cube,         color: '#ef4444' },
  cpu_cooler:  { label: 'Ventrads',         icon: Wind,         color: '#14b8a6' },
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Users; color: string }) {
  return (
    <div className="dashboard__stat-card">
      <div className="dashboard__stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={24} weight="fill" />
      </div>
      <div className="dashboard__stat-info">
        <span className="dashboard__stat-value">{value.toLocaleString('fr-FR')}</span>
        <span className="dashboard__stat-label">{label}</span>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { stats: data, error: err } = await adminService.getDashboardStats()
      if (cancelled) return
      setStats(data)
      setError(err)
      setLoading(false)
    }
    void load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="dashboard__loading"><Spinner size="lg" /></div>

  return (
    <div className="dashboard">
      {error && <Alert variant="error" title="Erreur" dismissible onDismiss={() => setError(null)}>{error}</Alert>}

      {/* Top stats */}
      <div className="dashboard__top-stats">
        <StatCard label="Utilisateurs" value={stats?.totalUsers ?? 0} icon={Users} color="#2563eb" />
        <StatCard label="Produits total" value={stats?.totalProducts ?? 0} icon={Package} color="#8b5cf6" />
      </div>

      {/* Quick links */}
      <div className="dashboard__quick-links">
        <Link to="/admin/users" className="dashboard__quick-link">
          <Users size={20} />
          <span>Gérer les utilisateurs</span>
        </Link>
        <Link to="/admin/products" className="dashboard__quick-link">
          <Package size={20} />
          <span>Gérer les produits</span>
        </Link>
      </div>

      {/* Products by category */}
      <Card>
        <Card.Header>
          <h2 className="dashboard__section-title">Produits par catégorie</h2>
        </Card.Header>
        <Card.Body>
          <div className="dashboard__categories">
            {Object.entries(CATEGORY_META).map(([key, meta]) => {
              const Icon = meta.icon
              const count = stats?.productsByCategory[key] ?? 0
              return (
                <div key={key} className="dashboard__category-row">
                  <div className="dashboard__category-icon" style={{ color: meta.color }}>
                    <Icon size={18} weight="fill" />
                  </div>
                  <span className="dashboard__category-label">{meta.label}</span>
                  <div className="dashboard__category-bar-wrap">
                    <div
                      className="dashboard__category-bar"
                      style={{
                        width: `${Math.round((count / (stats?.totalProducts || 1)) * 100)}%`,
                        background: meta.color,
                      }}
                    />
                  </div>
                  <span className="dashboard__category-count">{count.toLocaleString('fr-FR')}</span>
                </div>
              )
            })}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminDashboard

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService, type DashboardStats } from '../../services'
import './Dashboard.scss'

interface CategoryMeta { label: string; icon: string; color: string }

const CATEGORY_META: Record<string, CategoryMeta> = {
  cpu:         { label: 'Processeurs',       icon: '⚡', color: '#3B82F6' },
  gpu:         { label: 'Cartes graphiques', icon: '🎮', color: '#EF4444' },
  ram:         { label: 'RAM',               icon: '🧠', color: '#22C55E' },
  motherboard: { label: 'Cartes mères',      icon: '🔌', color: '#0EA5E9' },
  storage:     { label: 'Stockage',          icon: '💾', color: '#F59E0B' },
  psu:         { label: 'Alimentations',     icon: '⚡', color: '#F59E0B' },
  pc_case:     { label: 'Boîtiers',          icon: '🖥️', color: '#A855F7' },
  cpu_cooler:  { label: 'Refroidissement',   icon: '❄️', color: '#14B8A6' },
}

interface StatDef {
  key: string
  label: string
  value: number
  icon: string
  color: string
  bg: string
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

  const totalProducts = stats?.totalProducts ?? 0

  const statCards: StatDef[] = [
    { key: 'users',    label: 'Utilisateurs',  value: stats?.totalUsers    ?? 0, icon: '◉', color: '#6366F1', bg: 'USR' },
    { key: 'products', label: 'Produits',      value: totalProducts,             icon: '◫', color: '#A855F7', bg: 'PRD' },
    { key: 'images',   label: 'Avec image',    value: stats?.withImage     ?? 0, icon: '◐', color: '#10B981', bg: 'IMG' },
    { key: 'prices',   label: 'Avec prix',     value: stats?.withPrice     ?? 0, icon: '€', color: '#F59E0B', bg: 'EUR' },
  ]

  return (
    <div className="dashboard">
      {error && (
        <div className="ad-alert-err">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Fermer">×</button>
        </div>
      )}

      {loading ? (
        <div className="ad-loading">Chargement…</div>
      ) : (
        <>
          <div className="ad-stats">
            {statCards.map((s) => (
              <div key={s.key} className="ad-stat">
                <div
                  className="ad-stat__ico"
                  style={{ background: `${s.color}1A`, color: s.color }}
                >
                  {s.icon}
                </div>
                <div className="ad-stat__n">{s.value.toLocaleString('fr-FR')}</div>
                <div className="ad-stat__l">{s.label}</div>
                <div className="ad-stat__bg">{s.bg}</div>
              </div>
            ))}
          </div>

          <div className="ad-quick">
            <Link to="/admin/users" className="ad-quick__item">
              <div className="ad-quick__ico" style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8' }}>◉</div>
              <div>
                <div className="ad-quick__label">Gérer les utilisateurs</div>
                <div className="ad-quick__sub">Comptes, rôles, accès</div>
              </div>
            </Link>
            <Link to="/admin/products" className="ad-quick__item">
              <div className="ad-quick__ico" style={{ background: 'rgba(168,85,247,0.12)', color: '#C084FC' }}>◫</div>
              <div>
                <div className="ad-quick__label">Gérer les produits</div>
                <div className="ad-quick__sub">Catalogue & specs</div>
              </div>
            </Link>
            <Link to="/" className="ad-quick__item">
              <div className="ad-quick__ico" style={{ background: 'rgba(16,185,129,0.12)', color: '#34D399' }}>↗</div>
              <div>
                <div className="ad-quick__label">Voir le site public</div>
                <div className="ad-quick__sub">Aperçu utilisateur</div>
              </div>
            </Link>
          </div>

          <div className="ad-block">
            <div className="ad-block__hd">
              <div className="ad-block__title">Produits par catégorie</div>
              <div className="ad-count">{totalProducts.toLocaleString('fr-FR')} produits</div>
            </div>
            <div className="ad-block__body">
              {Object.entries(CATEGORY_META).map(([key, meta]) => {
                const count = stats?.productsByCategory[key] ?? 0
                const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0
                return (
                  <div key={key} className="ad-cat-row">
                    <div className="ad-cat-ico" style={{ color: meta.color }}>{meta.icon}</div>
                    <div className="ad-cat-lbl">{meta.label}</div>
                    <div className="ad-cat-bar-wrap">
                      <div
                        className="ad-cat-bar"
                        style={{ width: `${pct}%`, background: meta.color }}
                      />
                    </div>
                    <div className="ad-cat-count">{count.toLocaleString('fr-FR')}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Package, Image, CurrencyEur, ArrowUpRight, X, type Icon } from '@phosphor-icons/react'
import { adminService, type DashboardStats } from '../../services'
import { CategoryIcon } from '../../components/common'
import type { CategoryKey } from '../../types'
import './Dashboard.scss'

interface CategoryMeta { label: string; color: string }

const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  cpu:         { label: 'Processeurs',       color: '#60A5FA' },
  gpu:         { label: 'Cartes graphiques', color: '#F87171' },
  ram:         { label: 'RAM',               color: '#4ADE80' },
  motherboard: { label: 'Cartes mères',      color: '#38BDF8' },
  storage:     { label: 'Stockage',          color: '#FBBF24' },
  psu:         { label: 'Alimentations',     color: '#FB923C' },
  pc_case:     { label: 'Boîtiers',          color: '#C084FC' },
  cpu_cooler:  { label: 'Refroidissement',   color: '#2DD4BF' },
}

interface StatDef {
  key: string
  label: string
  value: number
  icon: Icon
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
    { key: 'users',    label: 'Utilisateurs',  value: stats?.totalUsers    ?? 0, icon: Users,       color: '#818CF8', bg: 'USR' },
    { key: 'products', label: 'Produits',      value: totalProducts,             icon: Package,     color: '#C084FC', bg: 'PRD' },
    { key: 'images',   label: 'Avec image',    value: stats?.withImage     ?? 0, icon: Image,       color: '#34D399', bg: 'IMG' },
    { key: 'prices',   label: 'Avec prix',     value: stats?.withPrice     ?? 0, icon: CurrencyEur, color: '#FBBF24', bg: 'EUR' },
  ]

  return (
    <div className="dashboard">
      {error && (
        <div className="adm-alert-err">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Fermer"><X weight="bold" /></button>
        </div>
      )}

      {loading ? (
        <div className="adm-loading">Chargement…</div>
      ) : (
        <>
          <div className="adm-stats">
            {statCards.map((s) => {
              const Ico = s.icon
              return (
                <div key={s.key} className="adm-stat">
                  <div
                    className="adm-stat__ico"
                    style={{ background: `${s.color}1A`, color: s.color }}
                  >
                    <Ico size={22} weight="duotone" />
                  </div>
                  <div className="adm-stat__n">{s.value.toLocaleString('fr-FR')}</div>
                  <div className="adm-stat__l">{s.label}</div>
                  <div className="adm-stat__bg">{s.bg}</div>
                </div>
              )
            })}
          </div>

          <div className="adm-quick">
            <Link to="/admin/users" className="adm-quick__item">
              <div className="adm-quick__ico" style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8' }}><Users size={22} weight="duotone" /></div>
              <div>
                <div className="adm-quick__label">Gérer les utilisateurs</div>
                <div className="adm-quick__sub">Comptes, rôles, accès</div>
              </div>
            </Link>
            <Link to="/admin/products" className="adm-quick__item">
              <div className="adm-quick__ico" style={{ background: 'rgba(168,85,247,0.12)', color: '#C084FC' }}><Package size={22} weight="duotone" /></div>
              <div>
                <div className="adm-quick__label">Gérer les produits</div>
                <div className="adm-quick__sub">Catalogue & specs</div>
              </div>
            </Link>
            <Link to="/" className="adm-quick__item">
              <div className="adm-quick__ico" style={{ background: 'rgba(16,185,129,0.12)', color: '#34D399' }}><ArrowUpRight size={22} weight="bold" /></div>
              <div>
                <div className="adm-quick__label">Voir le site public</div>
                <div className="adm-quick__sub">Aperçu utilisateur</div>
              </div>
            </Link>
          </div>

          <div className="adm-block">
            <div className="adm-block__hd">
              <div className="adm-block__title">Produits par catégorie</div>
              <div className="adm-count">{totalProducts.toLocaleString('fr-FR')} produits</div>
            </div>
            <div className="adm-block__body">
              {Object.entries(CATEGORY_META).map(([key, meta]) => {
                const count = stats?.productsByCategory[key] ?? 0
                const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0
                return (
                  <div key={key} className="adm-cat-row">
                    <div className="adm-cat-ico" style={{ color: meta.color }}><CategoryIcon cat={key as CategoryKey} size={20} weight="duotone" /></div>
                    <div className="adm-cat-lbl">{meta.label}</div>
                    <div className="adm-cat-bar-wrap">
                      <div
                        className="adm-cat-bar"
                        style={{ width: `${pct}%`, background: meta.color }}
                      />
                    </div>
                    <div className="adm-cat-count">{count.toLocaleString('fr-FR')}</div>
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

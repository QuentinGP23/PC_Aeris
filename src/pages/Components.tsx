import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MagnifyingGlass, CaretLeft, CaretRight, ArrowRight } from '@phosphor-icons/react'
import { supabase } from '../config'
import { CategoryIcon } from '../components/common'
import { CATEGORIES, type CategoryKey, type Product } from '../types'
import { KEY_SPECS, SPEC_LABELS, SPEC_UNITS } from '../constants'
import './Components.scss'

const PAGE_SIZE = 24
type SortKey = 'name' | 'price' | 'bench'

function specStr(val: unknown, unit?: string): string {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'Oui' : 'Non'
  if (Array.isArray(val)) return val.join(', ') || '—'
  if (typeof val === 'object') return '—'
  const s = String(val)
  return unit ? `${s} ${unit}` : s
}

/**
 * Catalogue par catégorie — pages de consultation/tri, indépendantes du
 * configurateur (pas d'ordre imposé ni de filtre de compatibilité). Purement
 * informatif : chaque produit renvoie vers sa fiche détaillée.
 */
function Components() {
  const { category: catParam } = useParams<{ category?: string }>()
  const category = (CATEGORIES.find((c) => c.value === catParam)?.value ?? 'cpu') as CategoryKey
  // key={category} : la vue se remonte (état frais) à chaque changement de
  // catégorie, sans effet de reset.
  return <CatalogView key={category} category={category} />
}

function CatalogView({ category }: { category: CategoryKey }) {
  const catDef = CATEGORIES.find((c) => c.value === category)!
  const benchCat = category === 'cpu' || category === 'gpu'

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('name')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      const select = `id, name, manufacturer, series, variant, release_year, category, image_url, description, price_min_eur, price_max_eur, price_avg_eur, price_updated_at, retailer_url, benchmark_score, ${catDef.specsTable}(*)`

      let q = supabase.from('products').select(select, { count: 'exact' }).eq('category', category)
      if (sort === 'bench' && benchCat) q = q.order('benchmark_score', { ascending: false, nullsFirst: false })
      else if (sort === 'price') q = q.order('price_avg_eur', { ascending: true, nullsFirst: false })
      else q = q.order('name')
      q = q.range(from, to)
      if (search.trim()) q = q.ilike('name', `%${search.trim()}%`)

      const { data, count } = (await q) as { data: Array<Record<string, unknown>> | null; count: number | null }
      if (cancelled) return
      const rows: Product[] = (data ?? []).map((row) => {
        const sp = row[catDef.specsTable]
        const specs = (Array.isArray(sp) ? sp[0] : sp) as Record<string, unknown> | null
        return { ...(row as unknown as Product), specs: specs ?? null }
      })
      setProducts(rows)
      setTotal(count ?? 0)
      setLoading(false)
    }
    void run()
    return () => { cancelled = true }
  }, [category, sort, page, search, catDef.specsTable, benchCat])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const keySpecs = KEY_SPECS[category] ?? []

  return (
    <div className="cat">
      <div className="c">
        <header className="cat__head">
          <span className="cat__eye">Catalogue</span>
          <h1 className="cat__title">
            <CategoryIcon cat={category} size={30} weight="duotone" /> {catDef.label}
          </h1>
          <p className="cat__sub">
            {total.toLocaleString('fr-FR')} référence{total > 1 ? 's' : ''} — à titre informatif, pour consulter et comparer les composants.
            {' '}Pour assembler une config, passe par le <Link to="/configurateur">configurateur</Link>.
          </p>
        </header>

        <nav className="cat__tabs">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              to={`/composants/${c.value}`}
              className={`cat__tab ${c.value === category ? 'cat__tab--act' : ''}`}
            >
              <CategoryIcon cat={c.value} weight={c.value === category ? 'fill' : 'regular'} /> {c.label}
            </Link>
          ))}
        </nav>

        <div className="cat__bar">
          <div className="cat__search">
            <MagnifyingGlass />
            <input
              type="text"
              placeholder={`Rechercher un ${catDef.label.toLowerCase()}…`}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            />
          </div>
          <div className="cat__sort">
            <span>Trier</span>
            <button className={sort === 'name' ? 'is-on' : ''} onClick={() => { setSort('name'); setPage(0) }}>Nom</button>
            {benchCat && (
              <button className={sort === 'bench' ? 'is-on' : ''} onClick={() => { setSort('bench'); setPage(0) }}>Performance</button>
            )}
            <button className={sort === 'price' ? 'is-on' : ''} onClick={() => { setSort('price'); setPage(0) }}>Prix</button>
          </div>
        </div>

        {loading ? (
          <div className="cat__state">Chargement…</div>
        ) : products.length === 0 ? (
          <div className="cat__state">Aucun résultat.</div>
        ) : (
          <div className="cat__grid">
            {products.map((p) => (
              <Link key={p.id} to={`/produit/${p.id}`} className="cat-card" data-hover>
                <div className="cat-card__img">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} loading="lazy" />
                  ) : (
                    <CategoryIcon cat={category} size={40} weight="thin" />
                  )}
                </div>
                <div className="cat-card__body">
                  <div className="cat-card__name">{p.name}</div>
                  <div className="cat-card__meta">
                    {[p.manufacturer, p.series, p.release_year].filter(Boolean).join(' · ') || '—'}
                  </div>
                  {p.specs && keySpecs.length > 0 && (
                    <div className="cat-card__specs">
                      {keySpecs
                        .filter((k) => p.specs![k] !== null && p.specs![k] !== undefined)
                        .slice(0, 3)
                        .map((k) => (
                          <div key={k} className="cat-card__spec">
                            <span>{SPEC_LABELS[k] ?? k.replace(/_/g, ' ')}</span>
                            <b>{specStr(p.specs![k], SPEC_UNITS[k])}</b>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div className="cat-card__ft">
                  <div className="cat-card__price">
                    {p.price_avg_eur != null ? `~ ${Math.round(p.price_avg_eur).toLocaleString('fr-FR')} €` : <span className="cat-card__noprice">Prix indisponible</span>}
                    {p.benchmark_score != null && <span className="cat-card__bench">Bench {p.benchmark_score}</span>}
                  </div>
                  <span className="cat-card__link">Voir la fiche <ArrowRight weight="bold" /></span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="cat__pages">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}><CaretLeft weight="bold" /> Précédent</button>
            <span>Page {page + 1} / {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Suivant <CaretRight weight="bold" /></button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Components

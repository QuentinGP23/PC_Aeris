const { useState, useMemo } = React

/* ── MOCK DATA ── */
const ADMIN_STATS = {
  totalUsers: 1842, totalProducts: 24763, withImage: 18940, withPrice: 21200,
  productsByCategory: {
    cpu: 2400, gpu: 1800, motherboard: 3200, ram: 5600,
    storage: 4100, psu: 1200, pc_case: 2800, cpu_cooler: 3500
  }
}

const MOCK_USERS = [
  { id:'u1', email:'thomas.martin@gmail.com', pseudo:'ThomasM', first_name:'Thomas', last_name:'Martin', role:'admin', created_at:'2024-01-15T10:00:00Z', phone_number:'+33 6 12 34 56 78' },
  { id:'u2', email:'alice.dupont@gmail.com', pseudo:'AliceD', first_name:'Alice', last_name:'Dupont', role:'user', created_at:'2024-02-20T14:30:00Z', phone_number:null },
  { id:'u3', email:'lucas.bernard@gmail.com', pseudo:'LucasB', first_name:'Lucas', last_name:'Bernard', role:'user', created_at:'2024-03-10T09:15:00Z', phone_number:'+33 7 98 76 54 32' },
  { id:'u4', email:'emma.petit@gmail.com', pseudo:'EmmaP', first_name:'Emma', last_name:'Petit', role:'user', created_at:'2024-04-05T16:45:00Z', phone_number:null },
  { id:'u5', email:'noah.richard@gmail.com', pseudo:'NoahR', first_name:'Noah', last_name:'Richard', role:'user', created_at:'2024-04-18T11:20:00Z', phone_number:null },
  { id:'u6', email:'camille.roux@gmail.com', pseudo:'CamilleR', first_name:'Camille', last_name:'Roux', role:'user', created_at:'2024-05-02T08:00:00Z', phone_number:null },
  { id:'u7', email:'hugo.moreau@gmail.com', pseudo:'HugoM', first_name:'Hugo', last_name:'Moreau', role:'user', created_at:'2024-05-15T13:30:00Z', phone_number:'+33 6 55 44 33 22' },
]

const ALL_PRODUCTS = Object.entries(MOCK_PRODUCTS).flatMap(([cat, prods]) =>
  prods.map((p, i) => ({ ...p, category: cat, idx: i }))
)

const CAT_META = {
  cpu:         { label:'Processeurs',       color:'#3B82F6', icon:'⚡' },
  gpu:         { label:'Cartes graphiques', color:'#EF4444', icon:'🎮' },
  motherboard: { label:'Cartes mères',      color:'#6366F1', icon:'🔌' },
  ram:         { label:'RAM',               color:'#22C55E', icon:'💾' },
  storage:     { label:'Stockage',          color:'#F59E0B', icon:'💿' },
  psu:         { label:'Alimentations',     color:'#EC4899', icon:'🔋' },
  pc_case:     { label:'Boîtiers',          color:'#14B8A6', icon:'🖥️' },
  cpu_cooler:  { label:'Ventrads',          color:'#8B5CF6', icon:'❄️' },
}

/* ── MODAL ── */
function Modal({ open, onClose, title, size='md', footer, children }) {
  if (!open) return null
  return (
    <div className="ad-modal-overlay" onClick={e => { if (e.target===e.currentTarget) onClose() }}>
      <div className={`ad-modal ad-modal--${size}`}>
        <div className="ad-modal__hd">
          <span className="ad-modal__title">{title}</span>
          <button className="ad-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="ad-modal__body">{children}</div>
        {footer && <div className="ad-modal__ft">{footer}</div>}
      </div>
    </div>
  )
}

/* ── TOGGLE ── */
function Toggle({ checked, onChange, label }) {
  return (
    <div className="ad-toggle" onClick={() => onChange(!checked)}>
      <div className={`ad-toggle__sw ${checked ? 'ad-toggle__sw--on' : ''}`}>
        <div className="ad-toggle__knob" />
      </div>
      {label && <span className="ad-toggle__label">{label}</span>}
    </div>
  )
}

/* ── FORM FIELD ── */
function Fg({ label, children }) {
  return (
    <div className="ad-fg">
      <label className="ad-fg__l">{label}</label>
      {children}
    </div>
  )
}

/* ── ADMIN NAV ── */
function AdminNav({ page, setPage, navigate }) {
  const NAV_ITEMS = [
    { id:'dashboard', label:'Dashboard', ico:'📊', badge: null },
    { id:'products',  label:'Produits',  ico:'📦', badge: ALL_PRODUCTS.length.toLocaleString('fr-FR') },
    { id:'users',     label:'Utilisateurs', ico:'👥', badge: MOCK_USERS.length },
  ]
  return (
    <nav className="admin-nav">
      <div className="admin-nav__hd">
        <span className="admin-nav__label">Espace admin</span>
        <div className="admin-nav__title">PC Aeris BO</div>
      </div>
      <div className="admin-nav__body">
        <div className="admin-nav__section">Navigation</div>
        {NAV_ITEMS.map(item => (
          <button key={item.id} className={`admin-nav__item ${page===item.id?'admin-nav__item--act':''}`}
            onClick={() => setPage(item.id)}>
            <span className="admin-nav__item-ico">{item.ico}</span>
            <span>{item.label}</span>
            {item.badge && <span className="admin-nav__item-badge">{item.badge}</span>}
          </button>
        ))}
      </div>
      <div className="admin-nav__ft">
        <button className="admin-nav__back" onClick={() => navigate('home')}>
          ← Retour au site
        </button>
      </div>
    </nav>
  )
}

/* ── DASHBOARD ── */
function AdminDashboard() {
  const total = ADMIN_STATS.totalProducts
  const STAT_CARDS = [
    { n: ADMIN_STATS.totalUsers.toLocaleString('fr-FR'), l:'Utilisateurs', ico:'👥', bg:'u', color:'rgba(99,102,241,0.12)', delta:'+12%' },
    { n: ADMIN_STATS.totalProducts.toLocaleString('fr-FR'), l:'Produits total', ico:'📦', bg:'p', color:'rgba(139,92,246,0.12)', delta:'+3 200' },
    { n: ADMIN_STATS.withImage.toLocaleString('fr-FR'), l:'Avec image', ico:'🖼️', bg:'i', color:'rgba(16,185,129,0.12)', delta:'76%' },
    { n: ADMIN_STATS.withPrice.toLocaleString('fr-FR'), l:'Avec un prix', ico:'💶', bg:'€', color:'rgba(245,158,11,0.12)', delta:'86%' },
  ]

  return (
    <>
      <div className="admin-hd">
        <div className="admin-hd__ghost">DASHBOARD</div>
        <div className="admin-hd__left">
          <div className="admin-hd__eyebrow">01 / VUE D'ENSEMBLE</div>
          <div className="admin-hd__title">Dashboard</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,position:'relative'}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'var(--ok)',boxShadow:'0 0 8px var(--ok)'}}/>
          <span style={{fontFamily:'var(--fm)',fontSize:10,color:'var(--text-3)',letterSpacing:'0.1em'}}>SYSTÈME EN LIGNE</span>
        </div>
      </div>
      <div className="admin-body">
        {/* Stats */}
        <div className="ad-stats">
          {STAT_CARDS.map(s => (
            <div key={s.l} className="ad-stat">
              <div className="ad-stat__bg">{s.bg}</div>
              <div className="ad-stat__ico" style={{background:s.color}}>{s.ico}</div>
              <div className="ad-stat__n">{s.n}</div>
              <div className="ad-stat__l">{s.l}</div>
              <div className={`ad-stat__delta ad-stat__delta--up`} style={{marginTop:8}}>↑ {s.delta}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="ad-quick">
          {[
            { label:'Gérer les produits', sub:'Créer, modifier, supprimer', ico:'📦', bg:'rgba(99,102,241,0.12)', page:'products' },
            { label:'Gérer les utilisateurs', sub:'Rôles, accès, comptes', ico:'👥', bg:'rgba(139,92,246,0.12)', page:'users' },
            { label:'Voir le configurateur', sub:'Interface publique', ico:'⚙️', bg:'rgba(16,185,129,0.12)', page:'configurator' },
          ].map(item => (
            <div key={item.label} className="ad-quick__item">
              <div className="ad-quick__ico" style={{background:item.bg}}>{item.ico}</div>
              <div>
                <div className="ad-quick__label">{item.label}</div>
                <div className="ad-quick__sub">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="ad-block">
          <div className="ad-block__hd">
            <span className="ad-block__title">Produits par catégorie</span>
            <span style={{fontFamily:'var(--fm)',fontSize:10,color:'var(--text-3)',letterSpacing:'0.08em'}}>
              {total.toLocaleString('fr-FR')} TOTAL
            </span>
          </div>
          <div className="ad-block__body">
            {Object.entries(CAT_META).map(([key, meta]) => {
              const count = ADMIN_STATS.productsByCategory[key] ?? 0
              const pct = Math.round((count / total) * 100)
              return (
                <div key={key} className="ad-cat-row">
                  <span className="ad-cat-ico">{meta.icon}</span>
                  <span className="ad-cat-lbl">{meta.label}</span>
                  <div className="ad-cat-bar-wrap">
                    <div className="ad-cat-bar" style={{width:`${pct}%`, background:meta.color}} />
                  </div>
                  <span className="ad-cat-count">{count.toLocaleString('fr-FR')}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── PRODUCTS ── */
const CAT_OPTIONS = [
  { value:'all', label:'Toutes catégories' },
  ...Object.entries(CAT_META).map(([k,v]) => ({ value:k, label:v.label }))
]

function AdminProducts() {
  const [catFilter, setCatFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 8

  const [editProduct, setEditProduct] = useState(null) // null=closed, 'new'=create, obj=edit
  const [deleteProduct, setDeleteProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('info')
  const [form, setForm] = useState({})
  const [products, setProducts] = useState(ALL_PRODUCTS)

  const filtered = useMemo(() => {
    let list = products
    if (catFilter !== 'all') list = list.filter(p => p.category === catFilter)
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    const dir = sortDir === 'asc' ? 1 : -1
    list = [...list].sort((a,b) => {
      if (sortCol==='name') return dir * a.name.localeCompare(b.name)
      if (sortCol==='price') return dir * ((a.price_avg_eur||0) - (b.price_avg_eur||0))
      if (sortCol==='year') return dir * ((a.release_year||0) - (b.release_year||0))
      return 0
    })
    return list
  }, [products, catFilter, search, sortCol, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page+1) * PAGE_SIZE)

  const handleSort = col => {
    if (sortCol===col) setSortDir(d => d==='asc'?'desc':'asc')
    else { setSortCol(col); setSortDir('asc') }
    setPage(0)
  }
  const SortIco = ({ col }) => (
    <span style={{opacity: sortCol===col?1:0.3, marginLeft:4}}>
      {sortCol===col ? (sortDir==='asc'?'↑':'↓') : '↕'}
    </span>
  )

  const openEdit = (p) => {
    setEditProduct(p)
    setActiveTab('info')
    setForm({
      name: p.name, manufacturer: p.manufacturer||'', series: p.series||'',
      release_year: p.release_year||'', price_min: p.price_min_eur||'',
      price_avg: p.price_avg_eur||'', price_max: p.price_max_eur||'',
      image_url: p.image_url||'',
    })
  }
  const openCreate = () => {
    setEditProduct('new')
    setActiveTab('info')
    setForm({ name:'', manufacturer:'', series:'', release_year:'', price_min:'', price_avg:'', price_max:'', image_url:'', category:'cpu' })
  }
  const handleSave = () => {
    if (!form.name?.trim()) return
    if (editProduct === 'new') {
      const newP = { ...form, id:`new-${Date.now()}`, category: form.category||'cpu',
        price_min_eur: Number(form.price_min)||null, price_max_eur: Number(form.price_max)||null,
        price_avg_eur: Number(form.price_avg)||null, specs:{}, benchmark_score:null, image_url:null }
      setProducts(prev => [newP, ...prev])
    } else {
      setProducts(prev => prev.map(p => p.id===editProduct.id
        ? { ...p, name:form.name, manufacturer:form.manufacturer, series:form.series,
            release_year:Number(form.release_year)||p.release_year,
            price_avg_eur:Number(form.price_avg)||p.price_avg_eur } : p))
    }
    setEditProduct(null)
  }
  const handleDelete = () => {
    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id))
    setDeleteProduct(null)
  }

  const catBadgeClass = cat => `ad-badge ad-badge--${['cpu','gpu','ram'].includes(cat)?cat:'cat'}`

  return (
    <>
      <div className="admin-hd">
        <div className="admin-hd__ghost">PRODUITS</div>
        <div className="admin-hd__left">
          <div className="admin-hd__eyebrow">02 / CATALOGUE</div>
          <div className="admin-hd__title">Produits</div>
        </div>
        <button className="ad-btn ad-btn--ind" onClick={openCreate}>+ Nouveau produit</button>
      </div>
      <div className="admin-body">
        <div className="ad-toolbar">
          <input className="ad-input" placeholder="Rechercher un produit..." value={search}
            onChange={e=>{setSearch(e.target.value);setPage(0)}} style={{minWidth:240}} />
          <select className="ad-select" value={catFilter}
            onChange={e=>{setCatFilter(e.target.value);setPage(0)}}>
            {CAT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <span className="ad-count">{filtered.length.toLocaleString('fr-FR')} produit{filtered.length>1?'s':''}</span>
        </div>

        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th style={{width:44}}>IMG</th>
                <th onClick={()=>handleSort('name')}>NOM <SortIco col="name"/></th>
                <th>CATÉGORIE</th>
                <th>FABRICANT</th>
                <th onClick={()=>handleSort('year')}>ANNÉE <SortIco col="year"/></th>
                <th onClick={()=>handleSort('price')}>PRIX MOY. <SortIco col="price"/></th>
                <th style={{width:120}}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'var(--text-3)',fontFamily:'var(--fm)',fontSize:12,letterSpacing:'0.08em'}}>AUCUN PRODUIT TROUVÉ</td></tr>
              ) : paged.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="ad-thumb"/>
                      : <div style={{width:36,height:36,borderRadius:6,background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>
                          {CAT_META[p.category]?.icon}
                        </div>}
                  </td>
                  <td className="td-main" style={{maxWidth:240}}>
                    <div style={{fontWeight:600,fontSize:13,color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
                    <div style={{fontFamily:'var(--fm)',fontSize:10,color:'var(--text-3)',marginTop:1}}>{p.series || '—'}</div>
                  </td>
                  <td>
                    <span className={catBadgeClass(p.category)}>
                      {CAT_META[p.category]?.icon} {CAT_META[p.category]?.label || p.category}
                    </span>
                  </td>
                  <td className="td-mono">{p.manufacturer || <span className="ad-empty-cell">—</span>}</td>
                  <td className="td-mono">{p.release_year || <span className="ad-empty-cell">—</span>}</td>
                  <td className="td-mono">
                    {p.price_avg_eur != null
                      ? <span style={{color:'var(--text)'}}>{Math.round(p.price_avg_eur).toLocaleString('fr-FR')} €</span>
                      : <span className="ad-empty-cell">—</span>}
                  </td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="ad-btn ad-btn--ghost ad-btn--sm" onClick={()=>openEdit(p)}>Modifier</button>
                      <button className="ad-btn ad-btn--danger ad-btn--sm" onClick={()=>setDeleteProduct(p)}>Suppr.</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="ad-pagination">
              <button className="ad-btn ad-btn--ghost ad-btn--sm" disabled={page===0} onClick={()=>setPage(p=>p-1)}>← Préc.</button>
              <span className="ad-page-info">Page {page+1} / {totalPages}</span>
              <button className="ad-btn ad-btn--ghost ad-btn--sm" disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)}>Suiv. →</button>
            </div>
          )}
        </div>
      </div>

      {/* Edit / Create modal */}
      <Modal open={editProduct !== null} onClose={()=>setEditProduct(null)}
        title={editProduct==='new' ? 'Nouveau produit' : 'Modifier le produit'}
        size="lg"
        footer={<>
          <button className="ad-btn ad-btn--ghost" onClick={()=>setEditProduct(null)}>Annuler</button>
          <button className="ad-btn ad-btn--ind" onClick={handleSave}>
            {editProduct==='new' ? 'Créer' : 'Enregistrer'}
          </button>
        </>}>
        <div className="ad-tabs">
          {['info','specs'].map(t=>(
            <button key={t} className={`ad-tab ${activeTab===t?'ad-tab--act':''}`} onClick={()=>setActiveTab(t)}>
              {t==='info'?'Informations':'Caractéristiques'}
            </button>
          ))}
        </div>
        {activeTab==='info' && (
          <div className="ad-form">
            {editProduct==='new' && (
              <Fg label="Catégorie *">
                <select className="ad-fg__sel" value={form.category||'cpu'} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                  {Object.entries(CAT_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
              </Fg>
            )}
            <Fg label="Nom *">
              <input className="ad-fg__in" value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="AMD Ryzen 9 7950X" />
            </Fg>
            <div className="ad-row ad-row--2">
              <Fg label="Fabricant">
                <input className="ad-fg__in" value={form.manufacturer||''} onChange={e=>setForm(f=>({...f,manufacturer:e.target.value}))} placeholder="AMD" />
              </Fg>
              <Fg label="Série">
                <input className="ad-fg__in" value={form.series||''} onChange={e=>setForm(f=>({...f,series:e.target.value}))} placeholder="Ryzen 9" />
              </Fg>
            </div>
            <div className="ad-row ad-row--3">
              <Fg label="Prix min (€)">
                <input className="ad-fg__in" type="number" value={form.price_min||''} onChange={e=>setForm(f=>({...f,price_min:e.target.value}))} placeholder="449" />
              </Fg>
              <Fg label="Prix moyen (€)">
                <input className="ad-fg__in" type="number" value={form.price_avg||''} onChange={e=>setForm(f=>({...f,price_avg:e.target.value}))} placeholder="499" />
              </Fg>
              <Fg label="Prix max (€)">
                <input className="ad-fg__in" type="number" value={form.price_max||''} onChange={e=>setForm(f=>({...f,price_max:e.target.value}))} placeholder="549" />
              </Fg>
            </div>
            <div className="ad-row ad-row--2">
              <Fg label="Année de sortie">
                <input className="ad-fg__in" type="number" value={form.release_year||''} onChange={e=>setForm(f=>({...f,release_year:e.target.value}))} placeholder="2023" />
              </Fg>
              <Fg label="URL image">
                <input className="ad-fg__in" value={form.image_url||''} onChange={e=>setForm(f=>({...f,image_url:e.target.value}))} placeholder="https://..." />
              </Fg>
            </div>
            {form.image_url && (
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <img src={form.image_url} alt="preview" className="ad-preview-img" onError={e=>e.target.style.display='none'} />
                <span style={{fontFamily:'var(--fm)',fontSize:10,color:'var(--text-3)',letterSpacing:'0.06em'}}>APERÇU IMAGE</span>
              </div>
            )}
          </div>
        )}
        {activeTab==='specs' && editProduct && editProduct!=='new' && editProduct.specs && (
          <div className="specs-grid">
            {Object.entries(editProduct.specs).map(([k,v]) => (
              <div key={k} className={typeof v === 'boolean' ? 'specs-grid__bool' : ''}>
                {typeof v === 'boolean'
                  ? <Toggle checked={v} onChange={()=>{}} label={k.replace(/_/g,' ')} />
                  : <Fg label={k.replace(/_/g,' ')}>
                      <input className="ad-fg__in" defaultValue={String(v)} />
                    </Fg>}
              </div>
            ))}
          </div>
        )}
        {activeTab==='specs' && (editProduct==='new' || !editProduct?.specs || Object.keys(editProduct.specs||{}).length===0) && (
          <div style={{textAlign:'center',padding:'40px 20px',color:'var(--text-3)',fontFamily:'var(--fm)',fontSize:11,letterSpacing:'0.1em'}}>
            SAUVEGARDEZ D'ABORD LE PRODUIT POUR ACCÉDER AUX SPECS
          </div>
        )}
      </Modal>

      {/* Delete modal */}
      <Modal open={deleteProduct!==null} onClose={()=>setDeleteProduct(null)}
        title="Supprimer le produit" size="sm"
        footer={<>
          <button className="ad-btn ad-btn--ghost" onClick={()=>setDeleteProduct(null)}>Annuler</button>
          <button className="ad-btn ad-btn--danger" onClick={handleDelete}>Supprimer définitivement</button>
        </>}>
        <p className="ad-warn-text">Tu t'apprêtes à supprimer <strong style={{color:'var(--text)'}}>{deleteProduct?.name}</strong>.</p>
        <p className="ad-warn-danger">⚠ Cette action est irréversible.</p>
      </Modal>
    </>
  )
}

/* ── USERS ── */
function AdminUsers() {
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)
  const [users, setUsers] = useState(MOCK_USERS)
  const [form, setForm] = useState({})

  const filtered = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u =>
      u.email.toLowerCase().includes(q) ||
      (u.pseudo||'').toLowerCase().includes(q) ||
      (u.first_name||'').toLowerCase().includes(q) ||
      (u.last_name||'').toLowerCase().includes(q)
    )
  }, [users, search])

  const openEdit = u => {
    setEditUser(u)
    setForm({ pseudo:u.pseudo||'', first_name:u.first_name||'', last_name:u.last_name||'',
      phone_number:u.phone_number||'', role:u.role||'user' })
  }
  const handleSave = () => {
    setUsers(prev => prev.map(u => u.id===editUser.id ? {...u,...form} : u))
    setEditUser(null)
  }
  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id!==deleteUser.id))
    setDeleteUser(null)
  }

  const initials = u => ((u.first_name?.[0]||'') + (u.last_name?.[0]||u.email[0]||'')).toUpperCase() || u.email[0].toUpperCase()

  return (
    <>
      <div className="admin-hd">
        <div className="admin-hd__ghost">USERS</div>
        <div className="admin-hd__left">
          <div className="admin-hd__eyebrow">03 / UTILISATEURS</div>
          <div className="admin-hd__title">Utilisateurs</div>
        </div>
        <span style={{fontFamily:'var(--fm)',fontSize:10,color:'var(--text-3)',letterSpacing:'0.1em',position:'relative'}}>
          {users.length} COMPTES
        </span>
      </div>
      <div className="admin-body">
        <div className="ad-toolbar">
          <input className="ad-input" placeholder="Rechercher par email, pseudo, nom..."
            value={search} onChange={e=>setSearch(e.target.value)} style={{minWidth:300}} />
          <span className="ad-count">{filtered.length} utilisateur{filtered.length>1?'s':''}</span>
        </div>

        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>UTILISATEUR</th>
                <th>PSEUDO</th>
                <th>NOM COMPLET</th>
                <th>TÉLÉPHONE</th>
                <th>RÔLE</th>
                <th>INSCRIPTION</th>
                <th style={{width:130}}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div className="ad-avatar">{initials(u)}</div>
                      <span style={{fontSize:13,color:'var(--text)',fontWeight:500}}>{u.email}</span>
                    </div>
                  </td>
                  <td className="td-mono">{u.pseudo || <span className="ad-empty-cell">—</span>}</td>
                  <td>{u.first_name||u.last_name ? `${u.first_name||''} ${u.last_name||''}`.trim() : <span className="ad-empty-cell">—</span>}</td>
                  <td className="td-mono">{u.phone_number || <span className="ad-empty-cell">—</span>}</td>
                  <td>
                    <span className={`ad-badge ad-badge--${u.role==='admin'?'admin':'user'}`}>
                      {u.role==='admin'?'Admin':'User'}
                    </span>
                  </td>
                  <td className="td-mono">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="ad-btn ad-btn--ghost ad-btn--sm" onClick={()=>openEdit(u)}>Modifier</button>
                      <button className="ad-btn ad-btn--danger ad-btn--sm" onClick={()=>setDeleteUser(u)}>Suppr.</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={editUser!==null} onClose={()=>setEditUser(null)}
        title="Modifier l'utilisateur" size="md"
        footer={<>
          <button className="ad-btn ad-btn--ghost" onClick={()=>setEditUser(null)}>Annuler</button>
          <button className="ad-btn ad-btn--ind" onClick={handleSave}>Enregistrer</button>
        </>}>
        {editUser && (
          <div style={{marginBottom:16,padding:'10px 14px',background:'var(--surface-2)',borderRadius:'var(--rs)',
            fontFamily:'var(--fm)',fontSize:11,color:'var(--text-3)',letterSpacing:'0.06em'}}>
            {editUser.email}
          </div>
        )}
        <div className="ad-form">
          <Fg label="Pseudo">
            <input className="ad-fg__in" value={form.pseudo||''} onChange={e=>setForm(f=>({...f,pseudo:e.target.value}))} />
          </Fg>
          <div className="ad-row ad-row--2">
            <Fg label="Prénom">
              <input className="ad-fg__in" value={form.first_name||''} onChange={e=>setForm(f=>({...f,first_name:e.target.value}))} />
            </Fg>
            <Fg label="Nom">
              <input className="ad-fg__in" value={form.last_name||''} onChange={e=>setForm(f=>({...f,last_name:e.target.value}))} />
            </Fg>
          </div>
          <Fg label="Téléphone">
            <input className="ad-fg__in" type="tel" value={form.phone_number||''} onChange={e=>setForm(f=>({...f,phone_number:e.target.value}))} />
          </Fg>
          <Fg label="Rôle">
            <select className="ad-fg__sel" value={form.role||'user'} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </Fg>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal open={deleteUser!==null} onClose={()=>setDeleteUser(null)}
        title="Supprimer l'utilisateur" size="sm"
        footer={<>
          <button className="ad-btn ad-btn--ghost" onClick={()=>setDeleteUser(null)}>Annuler</button>
          <button className="ad-btn ad-btn--danger" onClick={handleDelete}>Supprimer</button>
        </>}>
        <p className="ad-warn-text">Supprimer <strong style={{color:'var(--text)'}}>{deleteUser?.pseudo||deleteUser?.email}</strong> ?</p>
        <p className="ad-warn-danger">⚠ Cette action est irréversible.</p>
      </Modal>
    </>
  )
}

/* ── MAIN WRAPPER ── */
function AerisAdmin({ navigate }) {
  const [adminPage, setAdminPage] = useState('dashboard')
  return (
    <div className="admin-wrap">
      <AdminNav page={adminPage} setPage={setAdminPage} navigate={navigate} />
      <div className="admin-content">
        {adminPage === 'dashboard' && <AdminDashboard />}
        {adminPage === 'products'  && <AdminProducts />}
        {adminPage === 'users'     && <AdminUsers />}
      </div>
    </div>
  )
}

Object.assign(window, { AerisAdmin })

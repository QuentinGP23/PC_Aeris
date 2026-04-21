const { useState, useContext, useMemo, useEffect } = React

/* ── CONFIGURATOR ── */
function AerisConfigurator({ config, setConfig }) {
  const { navigate } = useContext(RouterCtx)
  const [active, setActive] = useState('cpu')
  const [search, setSearch] = useState('')
  const [mfgFilter, setMfgFilter] = useState(null)
  const [sortBy, setSortBy] = useState('default')
  const [animKey, setAnimKey] = useState(0)

  const selectComponent = (catVal, product) =>
    setConfig(prev => ({ ...prev, [catVal]: product }))
  const removeComponent = (catVal) =>
    setConfig(prev => { const n = { ...prev }; delete n[catVal]; return n })
  const clearConfig = () => setConfig({})

  const handleCat = (cat) => {
    if (cat === active) return
    setActive(cat); setSearch(''); setMfgFilter(null); setSortBy('default')
    setAnimKey(k => k + 1)
  }

  const catDef = CATEGORIES.find(c => c.value === active)
  const catIndex = CATEGORIES.findIndex(c => c.value === active)

  const manufacturers = useMemo(() => {
    const all = MOCK_PRODUCTS[active] || []
    return [...new Set(all.map(p => p.manufacturer))]
  }, [active])

  const products = useMemo(() => {
    let all = MOCK_PRODUCTS[active] || []
    if (search.trim()) all = all.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (mfgFilter) all = all.filter(p => p.manufacturer === mfgFilter)
    if (sortBy === 'price-asc') all = [...all].sort((a,b)=>(a.price_avg_eur||0)-(b.price_avg_eur||0))
    if (sortBy === 'price-desc') all = [...all].sort((a,b)=>(b.price_avg_eur||0)-(a.price_avg_eur||0))
    if (sortBy === 'bench') all = [...all].sort((a,b)=>(b.benchmark_score||0)-(a.benchmark_score||0))
    return all
  }, [active, search, mfgFilter, sortBy])

  const selectedCount = Object.keys(config).length
  const totalPrice = Object.values(config).reduce((sum, p) => sum + (p.price_avg_eur || 0), 0)
  const maxBench = useMemo(() => Math.max(...(MOCK_PRODUCTS[active]||[]).map(p=>p.benchmark_score||0)), [active])

  return (
    <div style={{display:'grid', gridTemplateColumns:'300px 1fr', minHeight:'calc(100vh - 58px)'}}>

      {/* ─── SIDEBAR MANIFEST ─── */}
      <aside style={{background:'var(--surface)', borderRight:'1px solid var(--border)',
        position:'sticky', top:58, height:'calc(100vh - 58px)',
        display:'flex', flexDirection:'column', overflow:'hidden'}}>

        {/* Header */}
        <div style={{padding:'28px 28px 22px', borderBottom:'1px solid var(--border)', flexShrink:0}}>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:16}}>
            <span style={{fontFamily:'var(--fh)', fontSize:15, fontWeight:700, letterSpacing:'-0.025em'}}>BUILD CONFIG</span>
            <span style={{fontFamily:'var(--fm)', fontSize:9, color:'var(--text-3)', letterSpacing:'0.1em'}}>v2.6.1</span>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
            <div style={{flex:1, height:1.5, background:'var(--surface-3)', borderRadius:1, overflow:'hidden'}}>
              <div style={{height:'100%', background:`linear-gradient(90deg, var(--ind), var(--ind-l))`,
                width:`${(selectedCount/8)*100}%`, transition:'width 0.5s var(--ease)', borderRadius:1}} />
            </div>
            <span style={{fontFamily:'var(--fm)', fontSize:10, color:'var(--text-3)', letterSpacing:'0.06em'}}>{selectedCount}/8</span>
          </div>
          <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>
            {CATEGORIES.map(cat => (
              <div key={cat.value}
                style={{width:18, height:18, borderRadius:3,
                  background: config[cat.value] ? 'var(--ind)' : 'var(--surface-3)',
                  transition:'background 0.3s', title:cat.label}} />
            ))}
          </div>
        </div>

        {/* Category list */}
        <div style={{flex:1, overflowY:'auto', padding:'8px 0'}}>
          {CATEGORIES.map((cat, i) => {
            const sel = config[cat.value]
            const isAct = active === cat.value
            return (
              <div key={cat.value}
                onClick={() => handleCat(cat.value)}
                style={{display:'flex', alignItems:'flex-start', gap:14, padding:'13px 28px',
                  cursor:'pointer', transition:'background 0.13s',
                  borderLeft:`2px solid ${isAct ? 'var(--ind)' : 'transparent'}`,
                  background: isAct ? 'rgba(99,102,241,0.06)' : 'transparent'}}>
                <span style={{fontFamily:'var(--fm)', fontSize:9, color: sel ? 'var(--ok)' : isAct ? 'var(--ind-l)' : 'var(--text-3)',
                  letterSpacing:'0.1em', minWidth:22, paddingTop:1, transition:'color 0.2s'}}>
                  {String(i+1).padStart(2,'0')}
                </span>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontFamily:'var(--fm)', fontSize:9, color:'var(--text-3)',
                    textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3}}>
                    {cat.label}
                  </div>
                  {sel ? (
                    <>
                      <div style={{fontSize:12, fontWeight:600, color:'var(--text)',
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', letterSpacing:'-0.01em'}}>
                        {sel.name}
                      </div>
                      <div style={{fontFamily:'var(--fm)', fontSize:10, color:'var(--ok)', marginTop:2}}>
                        ✓ moy. {Math.round(sel.price_avg_eur)} €
                      </div>
                    </>
                  ) : (
                    <div style={{fontSize:12, color:'var(--text-3)', fontStyle:'italic'}}>Non sélectionné</div>
                  )}
                </div>
                {sel && (
                  <button onClick={e => { e.stopPropagation(); removeComponent(cat.value) }}
                    style={{width:18, height:18, borderRadius:'50%', border:'1px solid var(--border)',
                      background:'transparent', color:'var(--text-3)', fontSize:8, cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                      transition:'all 0.12s', marginTop:2}}>
                    ✕
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer total */}
        <div style={{padding:'20px 28px', borderTop:'1px solid var(--border)', flexShrink:0}}>
          <div style={{fontFamily:'var(--fm)', fontSize:9, color:'var(--text-3)',
            textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:6}}>
            Total estimé
          </div>
          <div style={{fontFamily:'var(--fm)', fontSize:28, fontWeight:500, letterSpacing:'-0.03em',
            color: totalPrice > 0 ? 'var(--text)' : 'var(--text-3)', marginBottom:16}}>
            {totalPrice > 0 ? `${Math.round(totalPrice).toLocaleString('fr-FR')} €` : '—'}
          </div>
          {selectedCount > 0 && (
            <button onClick={clearConfig}
              style={{width:'100%', padding:'8px', borderRadius:'var(--rs)',
                border:'1px solid var(--border)', background:'transparent',
                color:'var(--text-2)', fontFamily:'var(--fm)', fontSize:10,
                cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase',
                transition:'all 0.13s'}}
              onMouseEnter={e=>{e.target.style.borderColor='rgba(239,68,68,0.3)';e.target.style.color='var(--err)'}}
              onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--text-2)'}}>
              Réinitialiser la config
            </button>
          )}
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main style={{padding:'0', overflowY:'auto', background:'var(--bg)'}}>

        {/* Category Header */}
        <div style={{padding:'32px 40px 28px', borderBottom:'1px solid var(--border)',
          position:'relative', overflow:'hidden', background:'var(--surface)'}}>
          {/* Ghost watermark */}
          <div style={{position:'absolute', top:-40, right:-20, fontFamily:'var(--fh)',
            fontSize:160, fontWeight:700, lineHeight:1, letterSpacing:'-0.06em',
            color:'rgba(255,255,255,0.018)', pointerEvents:'none', userSelect:'none',
            whiteSpace:'nowrap'}}>
            {catDef?.label.toUpperCase()}
          </div>

          {/* Chapter line */}
          <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20}}>
            <span style={{fontFamily:'var(--fm)', fontSize:10, color:'var(--text-3)', letterSpacing:'0.12em'}}>
              {String(catIndex+1).padStart(2,'0')} / {String(CATEGORIES.length).padStart(2,'0')}
            </span>
            <div style={{flex:1, height:1, background:'var(--border)'}}/>
            <span style={{fontFamily:'var(--fm)', fontSize:10, color:'var(--text-3)', letterSpacing:'0.08em'}}>
              {products.length} RÉSULTAT{products.length>1?'S':''}
            </span>
          </div>

          {/* Title row */}
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative'}}>
            <div style={{display:'flex', alignItems:'center', gap:16}}>
              <div style={{width:48, height:48, borderRadius:12, background:'var(--surface-3)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>
                {catDef?.icon}
              </div>
              <div>
                <h1 style={{fontFamily:'var(--fh)', fontSize:26, fontWeight:700,
                  letterSpacing:'-0.04em', marginBottom:2}}>{catDef?.label}</h1>
                <div style={{fontFamily:'var(--fm)', fontSize:10, color:'var(--text-3)',
                  letterSpacing:'0.08em', textTransform:'uppercase'}}>
                  {catDef?.count} références disponibles
                </div>
              </div>
            </div>
            {config[active] && (
              <div style={{display:'flex', alignItems:'center', gap:10, padding:'8px 16px',
                background:'rgba(16,185,129,0.07)', border:'1px solid rgba(16,185,129,0.2)',
                borderRadius:'var(--rs)'}}>
                <span style={{color:'var(--ok)', fontSize:12}}>✓</span>
                <span style={{fontFamily:'var(--fm)', fontSize:11, color:'var(--ok)', letterSpacing:'0.04em'}}>
                  {config[active].name.slice(0,28)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{padding:'20px 40px', borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', background:'var(--surface)'}}>
          {/* Search */}
          <div style={{position:'relative', flex:1, minWidth:200}}>
            <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
              color:'var(--text-3)', fontSize:13, pointerEvents:'none'}}>⌕</span>
            <input
              style={{width:'100%', padding:'9px 12px 9px 36px', background:'var(--surface-2)',
                border:'1px solid var(--border)', borderRadius:'var(--rs)',
                color:'var(--text)', fontSize:13, fontFamily:'var(--fb)', outline:'none'}}
              placeholder={`Rechercher...`}
              value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Manufacturer pills */}
          <div style={{display:'flex', gap:6}}>
            <button onClick={() => setMfgFilter(null)}
              style={{padding:'6px 12px', borderRadius:100, fontFamily:'var(--fm)',
                fontSize:10, letterSpacing:'0.06em', cursor:'pointer', border:'1px solid',
                borderColor: !mfgFilter ? 'var(--ind)' : 'var(--border)',
                background: !mfgFilter ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: !mfgFilter ? 'var(--ind-l)' : 'var(--text-2)',
                transition:'all 0.13s'}}>
              TOUS
            </button>
            {manufacturers.map(m => (
              <button key={m} onClick={() => setMfgFilter(mfgFilter === m ? null : m)}
                style={{padding:'6px 12px', borderRadius:100, fontFamily:'var(--fm)',
                  fontSize:10, letterSpacing:'0.06em', cursor:'pointer', border:'1px solid',
                  borderColor: mfgFilter===m ? 'var(--ind)' : 'var(--border)',
                  background: mfgFilter===m ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: mfgFilter===m ? 'var(--ind-l)' : 'var(--text-2)',
                  transition:'all 0.13s'}}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{padding:'7px 12px', background:'var(--surface-2)', border:'1px solid var(--border)',
              borderRadius:'var(--rs)', color:'var(--text-2)', fontFamily:'var(--fm)',
              fontSize:10, letterSpacing:'0.06em', cursor:'pointer', outline:'none',
              textTransform:'uppercase'}}>
            <option value="default">TRI PAR DÉFAUT</option>
            <option value="price-asc">PRIX ↑</option>
            <option value="price-desc">PRIX ↓</option>
            {maxBench > 0 && <option value="bench">BENCHMARK ↓</option>}
          </select>
        </div>

        {/* Category tabs strip */}
        <div style={{padding:'14px 40px', borderBottom:'1px solid var(--border)',
          display:'flex', gap:4, overflowX:'auto', flexShrink:0, background:'var(--surface)'}}>
          {CATEGORIES.map(cat => {
            const sel = config[cat.value]
            return (
              <button key={cat.value} onClick={() => handleCat(cat.value)}
                style={{display:'flex', alignItems:'center', gap:6, padding:'5px 12px',
                  borderRadius:100, fontSize:11, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap',
                  border: `1px solid ${active===cat.value ? 'var(--ind)' : 'var(--border)'}`,
                  background: active===cat.value ? 'var(--ind)' : 'transparent',
                  color: active===cat.value ? 'white' : sel ? 'var(--text-2)' : 'var(--text-3)',
                  transition:'all 0.13s', fontFamily:'var(--fb)'}}>
                <span>{cat.icon}</span>
                <span style={{fontSize:12}}>{cat.label}</span>
                {sel && <span style={{width:10,height:10,borderRadius:'50%',
                  background:'rgba(16,185,129,0.2)',display:'flex',alignItems:'center',
                  justifyContent:'center',fontSize:7,color:'var(--ok)'}}>✓</span>}
              </button>
            )
          })}
        </div>

        {/* Product Grid */}
        <div style={{padding:'28px 40px 60px'}} key={animKey}>
          {products.length === 0 ? (
            <div style={{textAlign:'center', padding:'80px 20px', color:'var(--text-2)'}}>
              <div style={{fontFamily:'var(--fm)', fontSize:10, letterSpacing:'0.1em', marginBottom:8, color:'var(--text-3)'}}>AUCUN RÉSULTAT</div>
              Essaie un autre terme ou retire le filtre.
            </div>
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14}}>
              {products.map((product, idx) => {
                const isSelected = config[active]?.id === product.id
                const keySpecs = KEY_SPECS[active] || []
                const benchPct = product.benchmark_score && maxBench > 0
                  ? (product.benchmark_score / maxBench) * 100 : 0

                return (
                  <div key={product.id}
                    style={{background:'var(--surface)', border:`1px solid ${isSelected ? 'var(--ind)' : 'var(--border)'}`,
                      borderRadius:'var(--rl)', overflow:'hidden', display:'flex', flexDirection:'column',
                      transition:'all 0.22s var(--ease)', position:'relative',
                      boxShadow: isSelected ? `0 0 0 1px var(--ind), 0 16px 48px rgba(99,102,241,0.12)` : 'none',
                      cursor:'pointer'}}
                    onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor='var(--border-s)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,0.4)' }}}
                    onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}}>

                    {/* Category color strip */}
                    <div style={{height:2, background:catDef?.color || 'var(--ind)', flexShrink:0}} />

                    {/* Image area */}
                    <div style={{height:120, background:'var(--surface-2)', display:'flex',
                      alignItems:'center', justifyContent:'center', fontSize:36, position:'relative'}}>
                      {product.image_url ? <img src={product.image_url} alt={product.name} style={{maxHeight:100,maxWidth:'85%',objectFit:'contain'}} />
                        : <span>{catDef?.icon}</span>}
                      {/* Index */}
                      <span style={{position:'absolute', top:10, left:12, fontFamily:'var(--fm)',
                        fontSize:9, color:'var(--text-3)', letterSpacing:'0.1em'}}>
                        {String(idx+1).padStart(2,'0')}
                      </span>
                      {isSelected && (
                        <span style={{position:'absolute', top:10, right:10, padding:'3px 8px',
                          background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.25)',
                          borderRadius:100, fontFamily:'var(--fm)', fontSize:9, color:'var(--ok)',
                          letterSpacing:'0.06em', textTransform:'uppercase'}}>
                          ✓ SÉLECTIONNÉ
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{padding:'14px 16px 10px', flex:1, display:'flex', flexDirection:'column', gap:8}}>
                      <div>
                        <div style={{fontFamily:'var(--fh)', fontSize:13, fontWeight:700,
                          color:'var(--text)', lineHeight:1.25, letterSpacing:'-0.01em', marginBottom:3}}>
                          {product.name}
                        </div>
                        <div style={{fontFamily:'var(--fm)', fontSize:10, color:'var(--text-3)', letterSpacing:'0.04em'}}>
                          {[product.manufacturer, product.series, product.release_year].filter(Boolean).join(' · ')}
                        </div>
                      </div>

                      {/* Specs */}
                      {product.specs && keySpecs.length > 0 && (
                        <div style={{display:'flex', flexDirection:'column', gap:4}}>
                          {keySpecs.filter(k => product.specs[k] != null).map(k => (
                            <div key={k} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                              <span style={{fontSize:10, color:'var(--text-2)'}}>{k.replace(/_/g,' ')}</span>
                              <span style={{fontFamily:'var(--fm)', fontSize:10, color:'var(--text)', fontWeight:500}}>
                                {String(product.specs[k])}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Benchmark bar */}
                      {product.benchmark_score > 0 && (
                        <div>
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5}}>
                            <span style={{fontFamily:'var(--fm)', fontSize:9, color:'var(--text-3)',
                              textTransform:'uppercase', letterSpacing:'0.1em'}}>Benchmark</span>
                            <span style={{fontFamily:'var(--fm)', fontSize:11, color:'var(--ind-l)', fontWeight:500}}>
                              {product.benchmark_score.toLocaleString()}
                            </span>
                          </div>
                          <div style={{height:2, background:'var(--surface-3)', borderRadius:1}}>
                            <div style={{height:'100%', background:`linear-gradient(90deg, var(--ind), var(--ind-l))`,
                              borderRadius:1, width:`${benchPct}%`, transition:'width 0.6s var(--ease)'}} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{padding:'12px 16px 14px', borderTop:'1px solid var(--border)'}}>
                      {product.price_min_eur != null && (
                        <div style={{marginBottom:10}}>
                          <div style={{fontFamily:'var(--fm)', fontSize:15, fontWeight:500, color:'var(--text)', letterSpacing:'-0.01em'}}>
                            {Math.round(product.price_min_eur).toLocaleString('fr-FR')} – {Math.round(product.price_max_eur).toLocaleString('fr-FR')} €
                          </div>
                          {product.price_avg_eur && (
                            <div style={{fontFamily:'var(--fm)', fontSize:10, color:'var(--text-3)', marginTop:2}}>
                              moy. {Math.round(product.price_avg_eur).toLocaleString('fr-FR')} €
                            </div>
                          )}
                        </div>
                      )}
                      <div style={{display:'flex', flexDirection:'column', gap:6}}>
                        {isSelected ? (
                          <button onClick={() => removeComponent(active)}
                            style={{width:'100%', padding:'8px', borderRadius:'var(--rs)',
                              background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.22)',
                              color:'var(--ok)', fontFamily:'var(--fb)', fontSize:12, fontWeight:600,
                              cursor:'pointer', transition:'all 0.14s'}}>
                            ✓ Sélectionné — Retirer
                          </button>
                        ) : (
                          <button onClick={() => selectComponent(active, product)}
                            style={{width:'100%', padding:'8px', borderRadius:'var(--rs)',
                              background:'var(--ind)', border:'none', color:'white',
                              fontFamily:'var(--fb)', fontSize:12, fontWeight:600,
                              cursor:'pointer', transition:'all 0.14s'}}
                            onMouseEnter={e=>e.target.style.background='#7577F5'}
                            onMouseLeave={e=>e.target.style.background='var(--ind)'}>
                            Sélectionner
                          </button>
                        )}
                        <div onClick={() => navigate('product', { id: product.id })}
                          style={{textAlign:'center', fontFamily:'var(--fm)', fontSize:9,
                            color:'var(--text-3)', padding:'4px', cursor:'pointer',
                            letterSpacing:'0.1em', textTransform:'uppercase', transition:'color 0.13s'}}
                          onMouseEnter={e=>e.currentTarget.style.color='var(--ind-l)'}
                          onMouseLeave={e=>e.currentTarget.style.color='var(--text-3)'}>
                          VOIR LA FICHE →
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

/* ── PRODUCT DETAIL ── */
function AerisProductDetail({ productId, config, setConfig, navigate }) {
  const product = useMemo(() => {
    for (const cat of Object.keys(MOCK_PRODUCTS)) {
      const found = MOCK_PRODUCTS[cat].find(p => p.id === productId)
      if (found) return { ...found, catVal: cat }
    }
    return null
  }, [productId])

  if (!product) return (
    <div className="c pd-page">
      <div style={{textAlign:'center',padding:'80px 0',color:'var(--text-2)'}}>Produit introuvable.</div>
      <div style={{textAlign:'center'}}>
        <button onClick={() => navigate('configurator')}
          style={{padding:'8px 20px',borderRadius:'var(--rs)',border:'1px solid var(--border)',
            background:'transparent',color:'var(--text-2)',cursor:'pointer',fontSize:13}}>← Retour</button>
      </div>
    </div>
  )

  const catDef = CATEGORIES.find(c => c.value === product.catVal)
  const isSelected = config[product.catVal]?.id === product.id
  const specEntries = product.specs ? Object.entries(product.specs) : []

  const selectThis = () => setConfig(prev => ({ ...prev, [product.catVal]: product }))
  const removeThis = () => setConfig(prev => { const n={...prev}; delete n[product.catVal]; return n })

  return (
    <div className="c pd-page">
      <div className="breadcrumb">
        <span className="breadcrumb__it" onClick={() => navigate('configurator')}>Configurateur</span>
        <span className="breadcrumb__sep">/</span>
        <span className="breadcrumb__it" onClick={() => navigate('configurator')}>{catDef?.icon} {catDef?.label}</span>
        <span className="breadcrumb__sep">/</span>
        <span>{product.name}</span>
      </div>

      <div className="pd-grid">
        <div className="pd-left">
          <div className="pd-img" style={{position:'relative'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:catDef?.color||'var(--ind)'}} />
            {product.image_url ? <img src={product.image_url} alt={product.name} /> : <span>{catDef?.icon}</span>}
          </div>
          {product.price_min_eur != null && (
            <div className="pd-price">
              <div className="pd-price__l">Prix occasion estimé</div>
              <div className="pd-price__r">{Math.round(product.price_min_eur).toLocaleString('fr-FR')} – {Math.round(product.price_max_eur).toLocaleString('fr-FR')} €</div>
              {product.price_avg_eur && <div className="pd-price__a">Moy. {Math.round(product.price_avg_eur).toLocaleString('fr-FR')} €</div>}
            </div>
          )}
          <div className="pd-actions">
            {isSelected ? (
              <button onClick={removeThis} style={{width:'100%',padding:'12px',borderRadius:'var(--rs)',
                background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.22)',
                color:'var(--ok)',fontFamily:'var(--fb)',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                ✓ Dans ma config — Retirer
              </button>
            ) : (
              <button onClick={selectThis} style={{width:'100%',padding:'12px',borderRadius:'var(--rs)',
                background:'var(--ind)',border:'none',color:'white',
                fontFamily:'var(--fb)',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                Ajouter à ma configuration
              </button>
            )}
            <div className="pd-retailer">Voir chez le revendeur →</div>
          </div>
        </div>

        <div>
          <div className="pd-badge">{catDef?.icon} {catDef?.label}</div>
          <h1 className="pd-h1">{product.name}</h1>
          <p className="pd-meta">{[product.manufacturer, product.series, product.release_year].filter(Boolean).join(' · ')}</p>
          {product.benchmark_score && (
            <div className="pd-bench">
              <span className="pd-bench__l">Score benchmark</span>
              <span className="pd-bench__v">{product.benchmark_score.toLocaleString()}</span>
            </div>
          )}
          {product.description && (
            <div className="pd-desc">
              <div className="pd-sec-title">Description</div>
              <p>{product.description}</p>
            </div>
          )}
          {specEntries.length > 0 && (
            <div>
              <div className="pd-sec-title">Caractéristiques techniques</div>
              <table className="pd-specs-tbl">
                <tbody>
                  {specEntries.map(([k,v]) => (
                    <tr key={k}><td>{k.replace(/_/g,' ')}</td><td>{String(v)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Object.assign(window, { AerisConfigurator, AerisProductDetail })

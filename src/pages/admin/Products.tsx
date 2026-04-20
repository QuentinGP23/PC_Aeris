import { useState, useEffect } from 'react'
import { adminService, type AdminProduct } from '../../services'
import { CATEGORIES } from '../../types'
import type { CategoryKey } from '../../types'
import { Button, Input, Select, Textarea, Toggle, Table, Modal, Badge, Alert, Spinner } from '../../components/common'
import './Products.scss'

const PAGE_SIZE = 50

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Toutes les catégories' },
  ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
]

const BADGE_VARIANT: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  cpu: 'primary', gpu: 'error', ram: 'success', motherboard: 'info',
  storage: 'warning', psu: 'default', pc_case: 'default', cpu_cooler: 'default',
}

type FieldType = 'text' | 'number' | 'boolean' | 'array' | 'jsonb'
interface SpecsField { label: string; type: FieldType }

const SPECS_SCHEMA: Record<string, Record<string, SpecsField>> = {
  cpu_specs: {
    socket: { label: 'Socket', type: 'text' },
    microarchitecture: { label: 'Microarchitecture', type: 'text' },
    core_family: { label: 'Famille de core', type: 'text' },
    total_cores: { label: 'Cores total', type: 'number' },
    performance_cores: { label: 'Cores performance', type: 'number' },
    efficiency_cores: { label: 'Cores efficacité', type: 'number' },
    threads: { label: 'Threads', type: 'number' },
    perf_base_clock: { label: 'Freq. base perf (GHz)', type: 'number' },
    perf_boost_clock: { label: 'Freq. boost perf (GHz)', type: 'number' },
    eff_base_clock: { label: 'Freq. base eff (GHz)', type: 'number' },
    eff_boost_clock: { label: 'Freq. boost eff (GHz)', type: 'number' },
    l1_cache: { label: 'Cache L1', type: 'text' },
    l2_cache_mb: { label: 'Cache L2 (MB)', type: 'number' },
    l3_cache_mb: { label: 'Cache L3 (MB)', type: 'number' },
    tdp: { label: 'TDP (W)', type: 'number' },
    ppt: { label: 'PPT (W)', type: 'number' },
    integrated_graphics: { label: 'Graphique intégré', type: 'text' },
    igpu_base_clock: { label: 'iGPU freq. base (GHz)', type: 'number' },
    igpu_boost_clock: { label: 'iGPU freq. boost (GHz)', type: 'number' },
    ecc_support: { label: 'Support ECC', type: 'boolean' },
    includes_cooler: { label: 'Ventirad inclus', type: 'boolean' },
    packaging: { label: 'Packaging', type: 'text' },
    lithography: { label: 'Lithographie', type: 'text' },
    smt: { label: 'SMT', type: 'boolean' },
    max_memory_gb: { label: 'Mémoire max (GB)', type: 'number' },
    memory_types: { label: 'Types mémoire', type: 'array' },
    memory_channels: { label: 'Canaux mémoire', type: 'number' },
  },
  motherboard_specs: {
    socket: { label: 'Socket', type: 'text' },
    form_factor: { label: 'Facteur de forme', type: 'text' },
    chipset: { label: 'Chipset', type: 'text' },
    max_memory_gb: { label: 'Mémoire max (GB)', type: 'number' },
    ram_type: { label: 'Type RAM', type: 'text' },
    memory_slots: { label: 'Slots mémoire', type: 'number' },
    pcie_slots: { label: 'Slots PCIe (JSON)', type: 'jsonb' },
    m2_slots: { label: 'Slots M.2 (JSON)', type: 'jsonb' },
    sata_6gbs: { label: 'Ports SATA 6Gb/s', type: 'number' },
    sata_3gbs: { label: 'Ports SATA 3Gb/s', type: 'number' },
    u2: { label: 'Ports U.2', type: 'number' },
    wireless_networking: { label: 'WiFi', type: 'text' },
    onboard_ethernet: { label: 'Ethernet (JSON)', type: 'jsonb' },
    usb_headers: { label: 'Headers USB (JSON)', type: 'jsonb' },
    audio_chipset: { label: 'Chipset audio', type: 'text' },
    audio_channels: { label: 'Canaux audio', type: 'text' },
    ecc_support: { label: 'Support ECC', type: 'boolean' },
    raid_support: { label: 'Support RAID', type: 'boolean' },
    back_panel_ports: { label: 'Ports panneau arrière', type: 'array' },
  },
  ram_specs: {
    speed_mhz: { label: 'Vitesse (MHz)', type: 'number' },
    ram_type: { label: 'Type', type: 'text' },
    form_factor: { label: 'Facteur de forme', type: 'text' },
    modules_quantity: { label: 'Nombre de modules', type: 'number' },
    module_capacity_gb: { label: 'Capacité par module (GB)', type: 'number' },
    total_capacity_gb: { label: 'Capacité totale (GB)', type: 'number' },
    cas_latency: { label: 'Latence CAS', type: 'number' },
    timings: { label: 'Timings', type: 'text' },
    voltage: { label: 'Tension (V)', type: 'number' },
    ecc: { label: 'ECC', type: 'text' },
    registered: { label: 'Registered', type: 'text' },
    heat_spreader: { label: 'Dissipateur', type: 'boolean' },
    rgb: { label: 'RGB', type: 'boolean' },
    height_mm: { label: 'Hauteur (mm)', type: 'number' },
    profile_support: { label: 'Profils supportés', type: 'array' },
  },
  gpu_specs: {
    chipset_manufacturer: { label: 'Fabricant chipset', type: 'text' },
    chipset: { label: 'Chipset', type: 'text' },
    core_count: { label: 'Nombre de cores', type: 'number' },
    memory_gb: { label: 'VRAM (GB)', type: 'number' },
    memory_type: { label: 'Type mémoire', type: 'text' },
    core_base_clock: { label: 'Freq. base (MHz)', type: 'number' },
    core_boost_clock: { label: 'Freq. boost (MHz)', type: 'number' },
    effective_memory_clock: { label: 'Freq. mémoire eff. (MHz)', type: 'number' },
    memory_bus: { label: 'Bus mémoire (bits)', type: 'number' },
    interface: { label: 'Interface', type: 'text' },
    frame_sync: { label: 'Sync. image', type: 'text' },
    length_mm: { label: 'Longueur (mm)', type: 'number' },
    tdp: { label: 'TDP (W)', type: 'number' },
    case_expansion_slot_width: { label: 'Largeur slot boîtier', type: 'number' },
    total_slot_width: { label: 'Largeur totale slot', type: 'number' },
    cooling: { label: 'Refroidissement', type: 'text' },
    pcie_6_pin: { label: 'Connecteurs PCIe 6-pin', type: 'number' },
    pcie_8_pin: { label: 'Connecteurs PCIe 8-pin', type: 'number' },
    pcie_12vhpwr: { label: 'Connecteurs PCIe 12VHPWR', type: 'number' },
    pcie_12v_2x6: { label: 'Connecteurs PCIe 12V-2x6', type: 'number' },
    hdmi_2_1: { label: 'HDMI 2.1', type: 'number' },
    hdmi_2_0: { label: 'HDMI 2.0', type: 'number' },
    displayport_2_1: { label: 'DisplayPort 2.1', type: 'number' },
    displayport_1_4a: { label: 'DisplayPort 1.4a', type: 'number' },
    dvi_d: { label: 'DVI-D', type: 'number' },
    vga: { label: 'VGA', type: 'number' },
  },
  storage_specs: {
    capacity_gb: { label: 'Capacité (GB)', type: 'number' },
    storage_type: { label: 'Type', type: 'text' },
    form_factor: { label: 'Facteur de forme', type: 'text' },
    interface: { label: 'Interface', type: 'text' },
    nvme: { label: 'NVMe', type: 'boolean' },
    cache_mb: { label: 'Cache (MB)', type: 'number' },
  },
  psu_specs: {
    wattage: { label: 'Puissance (W)', type: 'number' },
    form_factor: { label: 'Facteur de forme', type: 'text' },
    efficiency_rating: { label: 'Certification efficacité', type: 'text' },
    modular: { label: 'Modulaire', type: 'text' },
    length_mm: { label: 'Longueur (mm)', type: 'number' },
    fanless: { label: 'Sans ventilateur', type: 'boolean' },
    atx_24_pin: { label: 'ATX 24-pin', type: 'number' },
    eps_8_pin: { label: 'EPS 8-pin', type: 'number' },
    pcie_12vhpwr: { label: 'PCIe 12VHPWR', type: 'number' },
    pcie_6_plus_2_pin: { label: 'PCIe 6+2-pin', type: 'number' },
    sata: { label: 'Connecteurs SATA', type: 'number' },
    molex_4_pin: { label: 'Molex 4-pin', type: 'number' },
  },
  pc_case_specs: {
    form_factor: { label: 'Facteur de forme', type: 'text' },
    supported_mobo_form_factors: { label: 'Cartes mères supportées', type: 'array' },
    side_panel: { label: 'Panneau latéral', type: 'text' },
    psu_included: { label: 'Alim. incluse', type: 'boolean' },
    supported_psu_form_factors: { label: 'Alim. supportées', type: 'array' },
    max_gpu_length_mm: { label: 'GPU max (mm)', type: 'number' },
    max_cpu_cooler_height_mm: { label: 'Ventirad max (mm)', type: 'number' },
    internal_35_bays: { label: 'Baies 3.5" int.', type: 'number' },
    internal_25_bays: { label: 'Baies 2.5" int.', type: 'number' },
    external_35_bays: { label: 'Baies 3.5" ext.', type: 'number' },
    external_525_bays: { label: 'Baies 5.25" ext.', type: 'number' },
    expansion_slots: { label: 'Slots extension', type: 'number' },
    front_usb_ports: { label: 'Ports USB avant', type: 'array' },
    depth_mm: { label: 'Profondeur (mm)', type: 'number' },
    width_mm: { label: 'Largeur (mm)', type: 'number' },
    height_mm: { label: 'Hauteur (mm)', type: 'number' },
    volume_liters: { label: 'Volume (L)', type: 'number' },
    weight_lbs: { label: 'Poids (lbs)', type: 'number' },
  },
  cpu_cooler_specs: {
    min_fan_rpm: { label: 'RPM min', type: 'number' },
    max_fan_rpm: { label: 'RPM max', type: 'number' },
    min_noise_db: { label: 'Bruit min (dB)', type: 'number' },
    max_noise_db: { label: 'Bruit max (dB)', type: 'number' },
    height_mm: { label: 'Hauteur (mm)', type: 'number' },
    cpu_sockets: { label: 'Sockets supportés', type: 'array' },
    water_cooled: { label: 'Watercooling', type: 'boolean' },
    radiator_size_mm: { label: 'Taille radiateur (mm)', type: 'number' },
    fanless: { label: 'Sans ventilateur', type: 'boolean' },
    fan_size_mm: { label: 'Taille ventilateur (mm)', type: 'number' },
    fan_quantity: { label: 'Nombre de ventilateurs', type: 'number' },
  },
}

type SpecsFormValues = Record<string, string | boolean>

function initSpecsForm(specs: Record<string, unknown> | null, schema: Record<string, SpecsField>): SpecsFormValues {
  const form: SpecsFormValues = {}
  for (const [key, field] of Object.entries(schema)) {
    const val = specs?.[key]
    if (field.type === 'boolean') {
      form[key] = val === true
    } else if (field.type === 'array') {
      form[key] = Array.isArray(val) ? val.join(', ') : val != null ? String(val) : ''
    } else if (field.type === 'jsonb') {
      form[key] = val != null ? JSON.stringify(val, null, 2) : ''
    } else {
      form[key] = val != null ? String(val) : ''
    }
  }
  return form
}

function specsFormToUpdates(form: SpecsFormValues, schema: Record<string, SpecsField>): Record<string, unknown> {
  const updates: Record<string, unknown> = {}
  for (const [key, field] of Object.entries(schema)) {
    const val = form[key]
    if (field.type === 'boolean') {
      updates[key] = val as boolean
    } else if (field.type === 'number') {
      const str = (val as string).trim()
      updates[key] = str !== '' ? Number(str) : null
    } else if (field.type === 'array') {
      const str = (val as string).trim()
      updates[key] = str ? str.split(',').map((s) => s.trim()).filter(Boolean) : null
    } else if (field.type === 'jsonb') {
      const str = (val as string).trim()
      if (!str) { updates[key] = null; continue }
      try { updates[key] = JSON.parse(str) } catch { updates[key] = str }
    } else {
      updates[key] = (val as string).trim() || null
    }
  }
  return updates
}

function SortIcon({ col, sortBy, sortDir }: { col: string; sortBy: string; sortDir: 'asc' | 'desc' }) {
  if (sortBy !== col) return <span className="admin-products__sort-icon admin-products__sort-icon--idle">↕</span>
  return <span className="admin-products__sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
}

type EditFormValues = {
  name: string
  manufacturer: string
  series: string
  variant: string
  release_year: string
  image_url: string
  price_min_eur: string
  price_max_eur: string
  price_avg_eur: string
}

const EMPTY_EDIT_FORM: EditFormValues = {
  name: '', manufacturer: '', series: '', variant: '', release_year: '', image_url: '',
  price_min_eur: '', price_max_eur: '', price_avg_eur: '',
}

function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [category, setCategory] = useState<CategoryKey | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Modal mode: null = closed, 'create' = new product, AdminProduct = edit existing
  const [modalMode, setModalMode] = useState<'create' | AdminProduct | null>(null)
  const [createCategory, setCreateCategory] = useState<CategoryKey>('cpu')
  const [activeTab, setActiveTab] = useState<'info' | 'specs'>('info')
  const [editForm, setEditForm] = useState<EditFormValues>(EMPTY_EDIT_FORM)
  const [specsForm, setSpecsForm] = useState<SpecsFormValues>({})
  const [originalSpecs, setOriginalSpecs] = useState<Record<string, unknown> | null>(null)
  const [specsLoading, setSpecsLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { products: data, total: t, error: err } = await adminService.listProducts(category, page, search, sortBy, sortDir)
      if (cancelled) return
      setProducts(data)
      setTotal(t)
      setError(err)
      setLoading(false)
    }
    void load()
    return () => { cancelled = true }
  }, [category, page, search, sortBy, sortDir])

  const handleCategoryChange = (val: string) => {
    setCategory(val as CategoryKey | 'all')
    setPage(0)
  }

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(0)
  }

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortDir('asc')
    }
    setPage(0)
  }

  const openCreate = () => {
    setModalMode('create')
    setCreateCategory('cpu')
    setActiveTab('info')
    setEditError(null)
    setEditForm(EMPTY_EDIT_FORM)
    setOriginalSpecs(null)
    setSpecsForm(initSpecsForm(null, SPECS_SCHEMA['cpu_specs']))
  }

  const handleCreateCategoryChange = (val: CategoryKey) => {
    setCreateCategory(val)
    const specsTable = CATEGORIES.find((c) => c.value === val)?.specsTable
    if (specsTable && SPECS_SCHEMA[specsTable]) {
      setSpecsForm(initSpecsForm(null, SPECS_SCHEMA[specsTable]))
    }
  }

  const openEdit = async (p: AdminProduct) => {
    setModalMode(p)
    setActiveTab('info')
    setEditError(null)
    setEditForm({
      name: p.name,
      manufacturer: p.manufacturer ?? '',
      series: p.series ?? '',
      variant: p.variant ?? '',
      release_year: p.release_year != null ? String(p.release_year) : '',
      image_url: p.image_url ?? '',
      price_min_eur: p.price_min_eur != null ? String(p.price_min_eur) : '',
      price_max_eur: p.price_max_eur != null ? String(p.price_max_eur) : '',
      price_avg_eur: p.price_avg_eur != null ? String(p.price_avg_eur) : '',
    })
    const specsTable = CATEGORIES.find((c) => c.value === p.category)?.specsTable
    if (specsTable && SPECS_SCHEMA[specsTable]) {
      setSpecsLoading(true)
      setSpecsForm({})
      setOriginalSpecs(null)
      const { specs } = await adminService.getProductSpecs(p.id, specsTable)
      setSpecsLoading(false)
      setOriginalSpecs(specs)
      setSpecsForm(initSpecsForm(specs, SPECS_SCHEMA[specsTable]))
    }
  }

  const buildProductPayload = () => ({
    name: editForm.name.trim(),
    manufacturer: editForm.manufacturer.trim() || null,
    series: editForm.series.trim() || null,
    variant: editForm.variant.trim() || null,
    release_year: editForm.release_year ? Number(editForm.release_year) : null,
    image_url: editForm.image_url.trim() || null,
    price_min_eur: editForm.price_min_eur ? Number(editForm.price_min_eur) : null,
    price_max_eur: editForm.price_max_eur ? Number(editForm.price_max_eur) : null,
    price_avg_eur: editForm.price_avg_eur ? Number(editForm.price_avg_eur) : null,
  })

  const handleSubmit = async () => {
    if (modalMode === null) return
    if (!editForm.name.trim()) { setEditError('Le nom est obligatoire'); return }

    setEditLoading(true)
    setEditError(null)

    if (modalMode === 'create') {
      const specsTable = CATEGORIES.find((c) => c.value === createCategory)?.specsTable
      const schema = specsTable ? SPECS_SCHEMA[specsTable] : null

      const { product, error: createErr } = await adminService.createProduct({
        ...buildProductPayload(),
        category: createCategory,
      })
      if (createErr || !product) {
        setEditLoading(false)
        setEditError(createErr ?? 'Création échouée')
        return
      }
      if (specsTable && schema) {
        const { error: specsErr } = await adminService.createProductSpecs(
          product.id, specsTable, specsFormToUpdates(specsForm, schema),
        )
        if (specsErr) {
          setEditLoading(false)
          setEditError(`Produit créé mais specs échouées : ${specsErr}`)
          return
        }
      }
    } else {
      const specsTable = CATEGORIES.find((c) => c.value === modalMode.category)?.specsTable
      const schema = specsTable ? SPECS_SCHEMA[specsTable] : null

      const [infoRes, specsRes] = await Promise.all([
        adminService.updateProduct(modalMode.id, buildProductPayload()),
        specsTable && schema
          ? adminService.updateProductSpecs(modalMode.id, specsTable, specsFormToUpdates(specsForm, schema))
          : Promise.resolve({ error: null }),
      ])
      const err = infoRes.error ?? specsRes.error
      if (err) { setEditLoading(false); setEditError(err); return }
    }

    setEditLoading(false)
    setModalMode(null)
    const { products: data, total: t } = await adminService.listProducts(category, page, search, sortBy, sortDir)
    setProducts(data)
    setTotal(t)
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    setDeleteLoading(true)
    const { error: err } = await adminService.deleteProduct(deletingProduct.id)
    setDeleteLoading(false)
    if (err) { setError(err); setDeletingProduct(null); return }
    setDeletingProduct(null)
    const { products: data, total: t } = await adminService.listProducts(category, page, search, sortBy, sortDir)
    setProducts(data)
    setTotal(t)
  }

  const handleResetSpecs = () => {
    if (!specsSchema) return
    setSpecsForm(initSpecsForm(originalSpecs, specsSchema))
  }

  const currentCategory: CategoryKey | null =
    modalMode === 'create' ? createCategory :
    modalMode ? modalMode.category : null
  const specsTable = currentCategory ? CATEGORIES.find((c) => c.value === currentCategory)?.specsTable : undefined
  const specsSchema = specsTable ? SPECS_SCHEMA[specsTable] : null
  const isCreateMode = modalMode === 'create'
  const modalOpen = modalMode !== null

  return (
    <div className="admin-products">
      {error && (
        <Alert variant="error" dismissible onDismiss={() => setError(null)} className="admin-products__alert">
          {error}
        </Alert>
      )}

      <div className="admin-products__toolbar">
        <Select
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        />
        <Input
          type="search"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          clearable
          onClear={() => handleSearch('')}
        />
        <span className="admin-products__count">{total.toLocaleString('fr-FR')} produit{total !== 1 ? 's' : ''}</span>
        <Button onClick={openCreate}>+ Créer un produit</Button>
      </div>

      {loading ? (
        <div className="admin-products__loading"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <div className="admin-products__empty">Aucun produit trouvé.</div>
      ) : (
        <Table hoverable>
          <Table.Head>
            <Table.Row>
              <Table.Th>Image</Table.Th>
              <Table.Th className="admin-products__th-sortable" onClick={() => handleSort('name')}>Nom <SortIcon col="name" sortBy={sortBy} sortDir={sortDir} /></Table.Th>
              <Table.Th className="admin-products__th-sortable" onClick={() => handleSort('category')}>Catégorie <SortIcon col="category" sortBy={sortBy} sortDir={sortDir} /></Table.Th>
              <Table.Th className="admin-products__th-sortable" onClick={() => handleSort('manufacturer')}>Fabricant <SortIcon col="manufacturer" sortBy={sortBy} sortDir={sortDir} /></Table.Th>
              <Table.Th className="admin-products__th-sortable" onClick={() => handleSort('series')}>Série <SortIcon col="series" sortBy={sortBy} sortDir={sortDir} /></Table.Th>
              <Table.Th className="admin-products__th-sortable" onClick={() => handleSort('release_year')}>Année <SortIcon col="release_year" sortBy={sortBy} sortDir={sortDir} /></Table.Th>
              <Table.Th className="admin-products__th-sortable" onClick={() => handleSort('price_avg_eur')}>Prix <SortIcon col="price_avg_eur" sortBy={sortBy} sortDir={sortDir} /></Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {products.map((p) => (
              <Table.Row key={p.id}>
                <Table.Td>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="admin-products__thumb" />
                  ) : (
                    <div className="admin-products__no-img">—</div>
                  )}
                </Table.Td>
                <Table.Td>
                  <span className="admin-products__name">{p.name}</span>
                </Table.Td>
                <Table.Td>
                  <Badge variant={BADGE_VARIANT[p.category] ?? 'default'} size="sm" rounded>
                    {CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category}
                  </Badge>
                </Table.Td>
                <Table.Td>{p.manufacturer || <span className="admin-products__empty">—</span>}</Table.Td>
                <Table.Td>{p.series || <span className="admin-products__empty">—</span>}</Table.Td>
                <Table.Td>{p.release_year || <span className="admin-products__empty">—</span>}</Table.Td>
                <Table.Td>
                  {p.price_avg_eur != null ? (
                    <span className="admin-products__price">{p.price_avg_eur.toFixed(2)} €</span>
                  ) : (
                    <span className="admin-products__empty">—</span>
                  )}
                </Table.Td>
                <Table.Td>
                  <div className="admin-products__actions">
                    <Button variant="outline" size="sm" onClick={() => { void openEdit(p) }}>Modifier</Button>
                    <Button variant="danger" size="sm" onClick={() => setDeletingProduct(p)}>Supprimer</Button>
                  </div>
                </Table.Td>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-products__pagination">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>← Précédent</Button>
          <span className="admin-products__page-info">Page {page + 1} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Suivant →</Button>
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalMode(null)} title={isCreateMode ? 'Créer un produit' : 'Modifier le produit'} size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalMode(null)}>Annuler</Button>
            <Button onClick={() => { void handleSubmit() }} isLoading={editLoading}>{isCreateMode ? 'Créer' : 'Enregistrer'}</Button>
          </>
        }
      >
        {editError && <Alert variant="error" className="admin-products__modal-alert">{editError}</Alert>}

        {/* Tabs */}
        <div className="admin-products__tabs">
          <button
            className={`admin-products__tab${activeTab === 'info' ? ' admin-products__tab--active' : ''}`}
            onClick={() => setActiveTab('info')}
            type="button"
          >
            Informations
          </button>
          <button
            className={`admin-products__tab${activeTab === 'specs' ? ' admin-products__tab--active' : ''}`}
            onClick={() => setActiveTab('specs')}
            type="button"
          >
            Caractéristiques
          </button>
        </div>

        {activeTab === 'info' && (
          <div className="admin-products__modal-form">
            {isCreateMode && (
              <Select
                label="Catégorie *"
                options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
                value={createCategory}
                onChange={(e) => handleCreateCategoryChange(e.target.value as CategoryKey)}
                fullWidth
              />
            )}
            <Input label="Nom *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} fullWidth />
            <div className="admin-products__modal-row">
              <Input label="Fabricant" value={editForm.manufacturer} onChange={(e) => setEditForm({ ...editForm, manufacturer: e.target.value })} fullWidth />
              <Input label="Série" value={editForm.series} onChange={(e) => setEditForm({ ...editForm, series: e.target.value })} fullWidth />
            </div>
            <div className="admin-products__modal-row">
              <Input label="Variante" value={editForm.variant} onChange={(e) => setEditForm({ ...editForm, variant: e.target.value })} fullWidth />
              <Input label="Année de sortie" type="number" value={editForm.release_year} onChange={(e) => setEditForm({ ...editForm, release_year: e.target.value })} fullWidth />
            </div>
            <div className="admin-products__modal-row">
              <Input label="Prix min (€)" type="number" value={editForm.price_min_eur} onChange={(e) => setEditForm({ ...editForm, price_min_eur: e.target.value })} fullWidth />
              <Input label="Prix moyen (€)" type="number" value={editForm.price_avg_eur} onChange={(e) => setEditForm({ ...editForm, price_avg_eur: e.target.value })} fullWidth />
              <Input label="Prix max (€)" type="number" value={editForm.price_max_eur} onChange={(e) => setEditForm({ ...editForm, price_max_eur: e.target.value })} fullWidth />
            </div>
            <Input label="URL image" value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} fullWidth />
            {editForm.image_url && (
              <div className="admin-products__modal-preview">
                <img src={editForm.image_url} alt="Aperçu" />
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="admin-products__specs-panel">
            {!specsLoading && specsSchema && (
              <div className="admin-products__specs-toolbar">
                <Button variant="outline" size="sm" onClick={handleResetSpecs}>
                  Réinitialiser
                </Button>
              </div>
            )}
            {specsLoading ? (
              <div className="admin-products__specs-loading"><Spinner size="md" /></div>
            ) : specsSchema ? (
              <div className="admin-products__specs-grid">
                {Object.entries(specsSchema).map(([key, field]) => {
                  if (field.type === 'boolean') {
                    return (
                      <div key={key} className="admin-products__specs-field admin-products__specs-field--bool">
                        <Toggle
                          label={field.label}
                          checked={specsForm[key] as boolean}
                          onChange={(e) => setSpecsForm({ ...specsForm, [key]: e.target.checked })}
                        />
                      </div>
                    )
                  }
                  if (field.type === 'jsonb') {
                    return (
                      <div key={key} className="admin-products__specs-field admin-products__specs-field--jsonb">
                        <Textarea
                          label={field.label}
                          value={specsForm[key] as string}
                          onChange={(e) => setSpecsForm({ ...specsForm, [key]: e.target.value })}
                          rows={3}
                          fullWidth
                        />
                      </div>
                    )
                  }
                  return (
                    <div key={key} className="admin-products__specs-field">
                      <Input
                        label={field.label + (field.type === 'array' ? ' (virgules)' : '')}
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={specsForm[key] as string}
                        onChange={(e) => setSpecsForm({ ...specsForm, [key]: e.target.value })}
                        fullWidth
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="admin-products__specs-empty">Aucun schéma disponible pour cette catégorie.</p>
            )}
          </div>
        )}
      </Modal>

      {/* Delete modal */}
      <Modal isOpen={!!deletingProduct} onClose={() => setDeletingProduct(null)} title="Supprimer le produit" size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletingProduct(null)}>Annuler</Button>
            <Button variant="danger" onClick={() => { void handleDelete() }} isLoading={deleteLoading}>Supprimer</Button>
          </>
        }
      >
        <p className="admin-products__delete-text">
          Es-tu sûr de vouloir supprimer <strong>{deletingProduct?.name}</strong> ?
        </p>
        <p className="admin-products__delete-warning">Cette action est irréversible.</p>
      </Modal>
    </div>
  )
}

export default AdminProducts

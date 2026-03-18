import { useState, useEffect } from 'react'
import { adminService, type AdminProduct } from '../../services'
import { CATEGORIES } from '../../types'
import type { CategoryKey } from '../../types'
import { Button, Input, Select, Table, Modal, Badge, Alert, Spinner } from '../../components/common'
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

function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [category, setCategory] = useState<CategoryKey | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [editForm, setEditForm] = useState({ name: '', manufacturer: '', series: '', variant: '', release_year: '', image_url: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { products: data, total: t, error: err } = await adminService.listProducts(category, page, search)
      if (cancelled) return
      setProducts(data)
      setTotal(t)
      setError(err)
      setLoading(false)
    }
    void load()
    return () => { cancelled = true }
  }, [category, page, search])

  const handleCategoryChange = (val: string) => {
    setCategory(val as CategoryKey | 'all')
    setPage(0)
  }

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(0)
  }

  const openEdit = (p: AdminProduct) => {
    setEditingProduct(p)
    setEditError(null)
    setEditForm({
      name: p.name,
      manufacturer: p.manufacturer ?? '',
      series: p.series ?? '',
      variant: p.variant ?? '',
      release_year: p.release_year != null ? String(p.release_year) : '',
      image_url: p.image_url ?? '',
    })
  }

  const handleEdit = async () => {
    if (!editingProduct) return
    setEditLoading(true)
    setEditError(null)
    const { error: err } = await adminService.updateProduct(editingProduct.id, {
      name: editForm.name || undefined,
      manufacturer: editForm.manufacturer || null,
      series: editForm.series || null,
      variant: editForm.variant || null,
      release_year: editForm.release_year ? Number(editForm.release_year) : null,
      image_url: editForm.image_url || null,
    })
    setEditLoading(false)
    if (err) { setEditError(err); return }
    setEditingProduct(null)
    const { products: data, total: t } = await adminService.listProducts(category, page, search)
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
    const { products: data, total: t } = await adminService.listProducts(category, page, search)
    setProducts(data)
    setTotal(t)
  }

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
              <Table.Th>Nom</Table.Th>
              <Table.Th>Catégorie</Table.Th>
              <Table.Th>Fabricant</Table.Th>
              <Table.Th>Série</Table.Th>
              <Table.Th>Année</Table.Th>
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
                  <div className="admin-products__actions">
                    <Button variant="outline" size="sm" onClick={() => openEdit(p)}>Modifier</Button>
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

      {/* Edit modal */}
      <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} title="Modifier le produit" size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingProduct(null)}>Annuler</Button>
            <Button onClick={handleEdit} isLoading={editLoading}>Enregistrer</Button>
          </>
        }
      >
        {editError && <Alert variant="error" className="admin-products__modal-alert">{editError}</Alert>}
        <div className="admin-products__modal-form">
          <Input label="Nom *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} fullWidth />
          <div className="admin-products__modal-row">
            <Input label="Fabricant" value={editForm.manufacturer} onChange={(e) => setEditForm({ ...editForm, manufacturer: e.target.value })} fullWidth />
            <Input label="Série" value={editForm.series} onChange={(e) => setEditForm({ ...editForm, series: e.target.value })} fullWidth />
          </div>
          <div className="admin-products__modal-row">
            <Input label="Variante" value={editForm.variant} onChange={(e) => setEditForm({ ...editForm, variant: e.target.value })} fullWidth />
            <Input label="Année de sortie" type="number" value={editForm.release_year} onChange={(e) => setEditForm({ ...editForm, release_year: e.target.value })} fullWidth />
          </div>
          <Input label="URL image" value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} fullWidth />
          {editForm.image_url && (
            <div className="admin-products__modal-preview">
              <img src={editForm.image_url} alt="Aperçu" />
            </div>
          )}
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal isOpen={!!deletingProduct} onClose={() => setDeletingProduct(null)} title="Supprimer le produit" size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletingProduct(null)}>Annuler</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteLoading}>Supprimer</Button>
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

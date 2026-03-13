import { useState, useCallback } from "react";
import { supabase } from "../config";

const CATEGORIES = [
  { value: "cpu", label: "CPU", specsTable: "cpu_specs" },
  { value: "gpu", label: "GPU", specsTable: "gpu_specs" },
  { value: "ram", label: "RAM", specsTable: "ram_specs" },
  { value: "motherboard", label: "Carte mère", specsTable: "motherboard_specs" },
  { value: "storage", label: "Stockage", specsTable: "storage_specs" },
  { value: "psu", label: "Alimentation", specsTable: "psu_specs" },
  { value: "pc_case", label: "Boîtier", specsTable: "pc_case_specs" },
  { value: "cpu_cooler", label: "Ventirad", specsTable: "cpu_cooler_specs" },
];

interface Product {
  id: string;
  name: string;
  manufacturer: string | null;
  series: string | null;
  release_year: number | null;
  category: string;
  image_url: string | null;
  specs: Record<string, unknown> | null;
}

function Components() {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const PAGE_SIZE = 50;

  const fetchProducts = useCallback(async (cat: string, pg: number, srch: string) => {
    setLoading(true);

    const specsTable = CATEGORIES.find((c) => c.value === cat)!.specsTable;
    const from = pg * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("products")
      .select(`*, ${specsTable}(*)`)
      .eq("category", cat)
      .order("name")
      .range(from, to);

    if (srch.trim()) {
      query = query.ilike("name", `%${srch.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setProducts([]);
    } else {
      setProducts(
        (data || []).map((p: Record<string, unknown>) => {
          const specs = p[specsTable] as Record<string, unknown>[] | Record<string, unknown> | null;
          return {
            ...p,
            specs: Array.isArray(specs) ? specs[0] || null : specs,
            [specsTable]: undefined,
          } as Product;
        })
      );
    }
    setLoading(false);
    setHasLoaded(true);
  }, []);

  // Initial load
  if (!hasLoaded && !loading) {
    fetchProducts(category, page, search);
  }

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(0);
    fetchProducts(cat, 0, search);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
    fetchProducts(category, 0, value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(category, newPage, search);
  };

  const renderValue = (val: unknown): string => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "boolean") return val ? "Oui" : "Non";
    if (Array.isArray(val)) return val.join(", ") || "—";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 1400, margin: "0 auto" }}>
      <h1>Composants PC</h1>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => handleCategoryChange(c.value)}
            style={{
              padding: "0.5rem 1rem",
              background: category === c.value ? "#2563eb" : "#e5e7eb",
              color: category === c.value ? "#fff" : "#000",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", maxWidth: 400, marginBottom: "1rem", borderRadius: 6, border: "1px solid #ccc" }}
      />

      {loading ? (
        <p>Chargement...</p>
      ) : products.length === 0 ? (
        <p>Aucun résultat.</p>
      ) : (
        <>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            Page {page + 1} — {products.length} résultats
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1rem" }}>
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: "1rem",
                  background: "#fafafa",
                }}
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    style={{ width: "100%", height: 180, objectFit: "contain", marginBottom: "0.5rem", background: "#fff" }}
                  />
                )}
                <h3 style={{ margin: "0 0 0.25rem", fontSize: "1rem" }}>{p.name}</h3>
                <p style={{ margin: "0 0 0.5rem", color: "#666", fontSize: "0.85rem" }}>
                  {[p.manufacturer, p.series, p.release_year].filter(Boolean).join(" · ")}
                </p>

                {p.specs && (
                  <table style={{ width: "100%", fontSize: "0.8rem", borderCollapse: "collapse" }}>
                    <tbody>
                      {Object.entries(p.specs)
                        .filter(([k]) => k !== "product_id")
                        .map(([key, val]) => (
                          <tr key={key} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "2px 4px", fontWeight: 600, whiteSpace: "nowrap", verticalAlign: "top" }}>
                              {key}
                            </td>
                            <td style={{ padding: "2px 4px", wordBreak: "break-word" }}>
                              {renderValue(val)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "center" }}>
            <button disabled={page === 0} onClick={() => handlePageChange(page - 1)} style={{ padding: "0.5rem 1rem" }}>
              Précédent
            </button>
            <button disabled={products.length < PAGE_SIZE} onClick={() => handlePageChange(page + 1)} style={{ padding: "0.5rem 1rem" }}>
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Components;

/**
 * Import BuildCores Open DB data into Supabase.
 *
 * Prerequisites:
 *   1. Clone the repo next to this project (or anywhere):
 *      git clone https://github.com/buildcores/buildcores-open-db.git
 *   2. Add SUPABASE_SERVICE_ROLE_KEY to your .env
 *
 * Usage:
 *   node scripts/import-buildcores.mjs <path-to-buildcores-open-db>
 *
 * Example:
 *   node scripts/import-buildcores.mjs ../buildcores-open-db
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// Mapping from BuildCores directory names to our categories
// ============================================================

const CATEGORY_MAP = {
  CPU: "cpu",
  GPU: "gpu",
  RAM: "ram",
  Motherboard: "motherboard",
  Storage: "storage",
  PSU: "psu",
  PCCase: "pc_case",
  CPUCooler: "cpu_cooler",
};

// ============================================================
// Extract shared product fields from any BuildCores JSON
// ============================================================

function extractProduct(data, category) {
  const m = data.metadata || {};
  const g = data.general_product_information || {};
  return {
    opendb_id: data.opendb_id || null,
    category,
    name: m.name || "Unknown",
    manufacturer: m.manufacturer || null,
    series: m.series || null,
    variant: m.variant || null,
    part_numbers: arrOrNull(m.part_numbers),
    release_year: m.releaseYear || null,
    color: m.manufacturer_color || null,
    amazon_sku: g.amazon_sku || null,
    newegg_sku: g.newegg_sku || null,
    bestbuy_sku: g.bestbuy_sku || null,
    walmart_sku: g.walmart_sku || null,
    manufacturer_url: g.manufacturer_url || null,
  };
}

// ============================================================
// Category-specific spec extractors
// ============================================================

function extractCpuSpecs(data) {
  const c = data.cores || {};
  const clk = data.clocks || {};
  const perf = clk.performance || {};
  const eff = clk.efficiency || {};
  const cache = data.cache || {};
  const s = data.specifications || {};
  const ig = s.integratedGraphics || {};
  const mem = s.memory || {};
  return {
    socket: data.socket || null,
    microarchitecture: data.microarchitecture || null,
    core_family: data.coreFamily || null,
    total_cores: c.total || null,
    performance_cores: c.performance || null,
    efficiency_cores: c.efficiency || null,
    threads: c.threads || null,
    perf_base_clock: perf.base || null,
    perf_boost_clock: perf.boost || null,
    eff_base_clock: eff.base || null,
    eff_boost_clock: eff.boost || null,
    l1_cache: cache.l1 || null,
    l2_cache_mb: cache.l2 || null,
    l3_cache_mb: cache.l3 || null,
    tdp: s.tdp || null,
    ppt: s.ppt || null,
    integrated_graphics: ig.model || null,
    igpu_base_clock: ig.baseClock || null,
    igpu_boost_clock: ig.boostClock || null,
    ecc_support: s.eccSupport ?? null,
    includes_cooler: s.includesCooler ?? null,
    packaging: s.packaging || null,
    lithography: s.lithography || null,
    smt: s.simultaneousMultithreading ?? null,
    max_memory_gb: mem.maxSupport || null,
    memory_types: arrOrNull(mem.types),
    memory_channels: mem.channels || null,
  };
}

function extractGpuSpecs(data) {
  const pc = data.power_connectors || {};
  const vo = data.video_outputs || {};
  return {
    chipset_manufacturer: data.chipset_manufacturer || null,
    chipset: data.chipset || null,
    core_count: data.core_count || null,
    memory_gb: data.memory || null,
    memory_type: data.memory_type || null,
    core_base_clock: data.core_base_clock || null,
    core_boost_clock: data.core_boost_clock || null,
    effective_memory_clock: data.effective_memory_clock || null,
    memory_bus: data.memory_bus || null,
    interface: data.interface || null,
    frame_sync: data.frame_sync || null,
    length_mm: data.length || null,
    tdp: data.tdp || null,
    case_expansion_slot_width: data.case_expansion_slot_width || null,
    total_slot_width: data.total_slot_width || null,
    cooling: data.cooling || null,
    pcie_6_pin: pc.pcie_6_pin || null,
    pcie_8_pin: pc.pcie_8_pin || null,
    pcie_12vhpwr: pc.pcie_12VHPWR || null,
    pcie_12v_2x6: pc.pcie_12V_2x6 || null,
    hdmi_2_1: vo.hdmi_2_1 || null,
    hdmi_2_0: vo.hdmi_2_0 || null,
    displayport_2_1: vo.displayport_2_1 || null,
    displayport_1_4a: vo.displayport_1_4a || null,
    dvi_d: vo.dvi_d || null,
    vga: vo.vga || null,
  };
}

function extractRamSpecs(data) {
  const mod = data.modules || {};
  return {
    speed_mhz: data.speed || null,
    ram_type: data.ram_type || null,
    form_factor: data.form_factor || null,
    modules_quantity: mod.quantity || null,
    module_capacity_gb: mod.capacity_gb || null,
    total_capacity_gb: data.capacity || null,
    cas_latency: data.cas_latency || null,
    timings: data.timings || null,
    voltage: data.voltage || null,
    ecc: data.ecc || null,
    registered: data.registered || null,
    heat_spreader: data.heat_spreader ?? null,
    rgb: data.rgb ?? null,
    height_mm: data.height || null,
    profile_support: arrOrNull(data.profile_support),
  };
}

function extractMotherboardSpecs(data) {
  const mem = data.memory || {};
  const sd = data.storage_devices || {};
  const uh = data.usb_headers || {};
  const audio = data.audio || {};
  return {
    socket: data.socket || null,
    form_factor: data.form_factor || null,
    chipset: data.chipset || null,
    max_memory_gb: mem.max || null,
    ram_type: mem.ram_type || null,
    memory_slots: mem.slots || null,
    pcie_slots: data.pcie_slots || null,
    m2_slots: data.m2_slots || null,
    sata_6gbs: sd.sata_6_gb_s || null,
    sata_3gbs: sd.sata_3_gb_s || null,
    u2: sd.u2 || null,
    wireless_networking: data.wireless_networking || null,
    onboard_ethernet: data.onboard_ethernet || null,
    usb_headers: Object.keys(uh).length ? uh : null,
    audio_chipset: audio.chipset || null,
    audio_channels: audio.channels || null,
    ecc_support: data.ecc_support ?? null,
    raid_support: data.raid_support ?? null,
    back_panel_ports: arrOrNull(data.back_panel_ports),
  };
}

function extractStorageSpecs(data) {
  return {
    capacity_gb: data.capacity || null,
    storage_type: data.storage_type || data.type || null,
    form_factor: data.form_factor || null,
    interface: data.interface || null,
    nvme: data.nvme ?? null,
    cache_mb: data.cache || null,
  };
}

function extractPsuSpecs(data) {
  const c = data.connectors || {};
  return {
    wattage: data.wattage || null,
    form_factor: data.form_factor || null,
    efficiency_rating: data.efficiency_rating || null,
    modular: data.modular || null,
    length_mm: data.length || null,
    fanless: data.fanless ?? null,
    atx_24_pin: c.atx_24_pin || null,
    eps_8_pin: c.eps_8_pin || null,
    pcie_12vhpwr: c.pcie_12vhpwr || null,
    pcie_6_plus_2_pin: c.pcie_6_plus_2_pin || null,
    sata: c.sata || null,
    molex_4_pin: c.molex_4_pin || null,
  };
}

function extractPcCaseSpecs(data) {
  const dim = data.dimensions_mm || {};
  return {
    form_factor: data.form_factor || null,
    supported_mobo_form_factors: arrOrNull(data.supported_motherboard_form_factors),
    side_panel: data.side_panel || null,
    psu_included: data.power_supply_included ?? null,
    supported_psu_form_factors: arrOrNull(data.supported_power_supply_form_factors),
    max_gpu_length_mm: data.max_video_card_length || null,
    max_cpu_cooler_height_mm: data.max_cpu_cooler_height || null,
    internal_35_bays: data.internal_3_5_bays || null,
    internal_25_bays: data.internal_2_5_bays || null,
    external_35_bays: data.external_3_5_bays || null,
    external_525_bays: data.external_5_25_bays || null,
    expansion_slots: data.expansion_slots || null,
    front_usb_ports: arrOrNull(data.front_usb_ports),
    depth_mm: dim.depth || null,
    width_mm: dim.width || null,
    height_mm: dim.height || null,
    volume_liters: data.volume || null,
    weight_lbs: data.weight || null,
  };
}

function extractCpuCoolerSpecs(data) {
  return {
    min_fan_rpm: data.min_fan_rpm || null,
    max_fan_rpm: data.max_fan_rpm || null,
    min_noise_db: data.min_noise_level || null,
    max_noise_db: data.max_noise_level || null,
    height_mm: data.height || null,
    cpu_sockets: arrOrNull(data.cpu_sockets),
    water_cooled: data.water_cooled ?? null,
    radiator_size_mm: data.radiator_size || null,
    fanless: data.fanless ?? null,
    fan_size_mm: data.fan_size || null,
    fan_quantity: data.fan_quantity || null,
  };
}

// Convert empty arrays to null
function arrOrNull(arr) {
  return Array.isArray(arr) && arr.length > 0 ? arr : null;
}

const SPEC_EXTRACTORS = {
  cpu: { table: "cpu_specs", fn: extractCpuSpecs },
  gpu: { table: "gpu_specs", fn: extractGpuSpecs },
  ram: { table: "ram_specs", fn: extractRamSpecs },
  motherboard: { table: "motherboard_specs", fn: extractMotherboardSpecs },
  storage: { table: "storage_specs", fn: extractStorageSpecs },
  psu: { table: "psu_specs", fn: extractPsuSpecs },
  pc_case: { table: "pc_case_specs", fn: extractPcCaseSpecs },
  cpu_cooler: { table: "cpu_cooler_specs", fn: extractCpuCoolerSpecs },
};

// ============================================================
// Read all JSON files from a directory
// ============================================================

function readJsonFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const content = fs.readFileSync(path.join(dirPath, f), "utf8");
    return JSON.parse(content);
  });
}

// ============================================================
// Batch upsert helper (chunks of 500)
// ============================================================

async function batchUpsert(table, rows, conflictColumn = "opendb_id") {
  const CHUNK_SIZE = 100;
  let total = 0;
  let errors = 0;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase
      .from(table)
      .upsert(chunk, { onConflict: conflictColumn, ignoreDuplicates: false });
    if (error) {
      errors++;
      if (errors <= 3) {
        console.error(`  Error chunk ${Math.floor(i / CHUNK_SIZE) + 1} into ${table}: ${error.message}`);
      }
    } else {
      total += chunk.length;
    }
  }
  if (errors > 3) {
    console.error(`  ... and ${errors - 3} more chunk errors in ${table}`);
  }
  return total;
}

// ============================================================
// Main import
// ============================================================

async function main() {
  const repoPath = process.argv[2];
  if (!repoPath) {
    console.error("Usage: node scripts/import-buildcores.mjs <path-to-buildcores-open-db>");
    process.exit(1);
  }

  const openDbPath = path.resolve(repoPath, "open-db");
  if (!fs.existsSync(openDbPath)) {
    console.error(`Directory not found: ${openDbPath}`);
    process.exit(1);
  }

  console.log(`Importing from: ${openDbPath}\n`);

  for (const [dirName, category] of Object.entries(CATEGORY_MAP)) {
    const dirPath = path.join(openDbPath, dirName);
    const items = readJsonFiles(dirPath);

    if (items.length === 0) {
      console.log(`[${dirName}] No files found, skipping.`);
      continue;
    }

    console.log(`[${dirName}] Found ${items.length} items...`);

    // 1. Insert products
    const products = items.map((d) => extractProduct(d, category));
    const insertedProducts = await batchUpsert("products", products);
    console.log(`  -> ${insertedProducts} products upserted.`);

    // 2. Get product IDs by opendb_id (paginate with small .in() chunks)
    const opendbIds = products.map((p) => p.opendb_id).filter(Boolean);
    const idMap = new Map();

    for (let i = 0; i < opendbIds.length; i += 200) {
      const chunk = opendbIds.slice(i, i + 200);
      const { data, error: fetchErr } = await supabase
        .from("products")
        .select("id, opendb_id")
        .in("opendb_id", chunk)
        .limit(200);
      if (fetchErr) {
        console.error(`  Error fetching product IDs:`, fetchErr.message);
      }
      if (data) {
        data.forEach((r) => idMap.set(r.opendb_id, r.id));
      }
    }
    console.log(`  -> ${idMap.size} product IDs resolved.`);

    // 3. Insert specs
    const specInfo = SPEC_EXTRACTORS[category];
    if (specInfo) {
      const specs = items
        .map((d) => {
          const productId = idMap.get(d.opendb_id);
          if (!productId) return null;
          return { product_id: productId, ...specInfo.fn(d) };
        })
        .filter(Boolean);

      const insertedSpecs = await batchUpsert(specInfo.table, specs, "product_id");
      console.log(`  -> ${insertedSpecs} specs upserted into ${specInfo.table}.`);
    }
  }

  console.log("\nImport complete!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

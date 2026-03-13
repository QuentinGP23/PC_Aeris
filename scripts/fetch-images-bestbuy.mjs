/**
 * Fetch product images from Best Buy API and store them in Supabase.
 *
 * Prerequisites:
 *   Add BESTBUY_API_KEY to your .env
 *
 * Usage:
 *   node scripts/fetch-images-bestbuy.mjs [category]
 *
 * Examples:
 *   node scripts/fetch-images-bestbuy.mjs          # all categories
 *   node scripts/fetch-images-bestbuy.mjs cpu       # only CPUs
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BESTBUY_KEY = process.env.BESTBUY_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}
if (!BESTBUY_KEY) {
  console.error("Missing BESTBUY_API_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Best Buy category IDs for PC components
const BB_CATEGORY_MAP = {
  cpu: "abcat0507010",
  gpu: "abcat0507002",
  ram: "abcat0507012",
  motherboard: "abcat0507008",
  storage: "pcmcat233000050017",
  psu: "abcat0507009",
  pc_case: "abcat0507003",
  cpu_cooler: "abcat0507023",
};

// Delay helper to respect rate limits (5 req/sec max, we do 3/sec to be safe)
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Search Best Buy for a product by name
async function searchBestBuy(productName, manufacturer) {
  // Clean up product name for search
  const query = manufacturer
    ? `${manufacturer} ${productName}`.slice(0, 100)
    : productName.slice(0, 100);

  const searchTerms = encodeURIComponent(query);
  const url = `https://api.bestbuy.com/v1/products((search=${searchTerms}))?apiKey=${BESTBUY_KEY}&format=json&pageSize=1&show=sku,name,image,largeFrontImage,largeImage,mediumImage,thumbnailImage`;

  try {
    const res = await fetch(url);
    if (res.status === 429) {
      // Rate limited, wait and retry
      console.log("    Rate limited, waiting 2s...");
      await delay(2000);
      return searchBestBuy(productName, manufacturer);
    }
    if (!res.ok) return null;

    const data = await res.json();
    if (data.products && data.products.length > 0) {
      const p = data.products[0];
      return p.largeFrontImage || p.largeImage || p.image || p.mediumImage || p.thumbnailImage || null;
    }
    return null;
  } catch {
    return null;
  }
}

// Process a batch of products
async function processCategory(category) {
  console.log(`\n[${category}] Fetching products without images...`);

  // Get all products in this category that don't have an image yet
  let allProducts = [];
  let from = 0;
  const PAGE = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, manufacturer")
      .eq("category", category)
      .is("image_url", null)
      .range(from, from + PAGE - 1);

    if (error) {
      console.error(`  Error fetching products:`, error.message);
      break;
    }
    if (!data || data.length === 0) break;
    allProducts = allProducts.concat(data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  console.log(`  ${allProducts.length} products need images.`);

  let found = 0;
  let notFound = 0;

  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    const imageUrl = await searchBestBuy(p.name, p.manufacturer);

    if (imageUrl) {
      const { error } = await supabase
        .from("products")
        .update({ image_url: imageUrl })
        .eq("id", p.id);

      if (!error) found++;
    } else {
      notFound++;
    }

    // Progress log every 50 products
    if ((i + 1) % 50 === 0 || i === allProducts.length - 1) {
      console.log(`  [${i + 1}/${allProducts.length}] found: ${found}, not found: ${notFound}`);
    }

    // Rate limit: ~3 requests/sec
    await delay(350);
  }

  console.log(`  Done: ${found} images found, ${notFound} not found.`);
}

async function main() {
  const targetCategory = process.argv[2];

  if (targetCategory) {
    if (!BB_CATEGORY_MAP[targetCategory]) {
      console.error(`Unknown category: ${targetCategory}`);
      console.error(`Valid categories: ${Object.keys(BB_CATEGORY_MAP).join(", ")}`);
      process.exit(1);
    }
    await processCategory(targetCategory);
  } else {
    for (const cat of Object.keys(BB_CATEGORY_MAP)) {
      await processCategory(cat);
    }
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

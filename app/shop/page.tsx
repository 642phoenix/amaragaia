"use client";
console.log("🛍️ Shop page rendered");

import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import { Product } from "@/types/product";
import Link from "next/link";

const ProductButton = dynamic(() => import("@/components/ProductButton"), { ssr: false });

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("name");
  const [products, setProducts] = useState<Product[]>([]);

  // fetch products from API
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("API DATA:", data);
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch(err => console.error("failed to load products", err));
  }, []);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let results = [...products];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory) {
      results = results.filter(p => p.category === selectedCategory);
    }

    // Sort
    if (sortBy === "price-asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      results.sort((a, b) => b.price - a.price);
    } else {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <section className="products container" style={{ paddingTop: "2rem" }}>
      <h2 className="section-title">Tienda</h2>

      {/* Search and Filter Bar */}
      <div style={{ marginBottom: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem" }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "0.95rem",
          }}
        />

        {/* Category Filter */}
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "0.95rem",
          }}
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "0.95rem",
          }}
        >
          <option value="name">A-Z</option>
          <option value="price-asc">Precio (menor)</option>
          <option value="price-desc">Precio (mayor)</option>
        </select>

        {/* Clear Filters */}
        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory(null);
            }}
            className="btn btn-outline"
            style={{ whiteSpace: "nowrap" }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Results count */}
      <p style={{ marginBottom: "1.5rem", color: "#666", fontSize: "0.9rem" }}>
        {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
      </p>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <div key={p.id} className="product-card">
              <Link href={`/shop/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <img src={p.image} alt={p.name} />
                <h3>{p.name}</h3>
                <p>${p.price}</p>
              </Link>
              <ProductButton product={p} />
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            <p style={{ fontSize: "1.1rem", color: "#999" }}>No se encontraron productos</p>
          </div>
        )}
      </div>
    </section>
  );
}
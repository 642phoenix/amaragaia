"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ProductButton = dynamic(() => import("@/components/ProductButton"), { ssr: false });
  
export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.slice(0,6)))
      .catch(err => console.error("load featured", err));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>AMAR A GAIA</h1>
          <p>Tu abasto sostenible</p>
          <button className="btn btn-primary" onClick={() => router.push("/shop")}>
            Explorar productos
          </button>
        </div>
      </section>

      <section className="products container">
        <h2 className="section-title">Productos Destacados</h2>
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} className="product-card">
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <ProductButton product={p} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

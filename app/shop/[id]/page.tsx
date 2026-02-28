"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import dynamic from "next/dynamic";

const Modal = dynamic(() => import("@/components/Modal"), { ssr: false });
const Portal = dynamic(() => import("@/components/Portal"), { ssr: false });

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const id = params.id as string;
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  // product state is loaded in effect below

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "alert" | "prompt";
    title: string;
    message: string;
    inputPlaceholder?: string;
  }>({
    isOpen: false,
    type: "prompt",
    title: "Cantidad",
    message: "",
    inputPlaceholder: "1",
  });

  useEffect(() => {
  if (!id) return;

  const loadProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        setProduct(null);
        return;
      }

      const data = await res.json();
      setProduct(data);

      // optional: fetch related products
      const rel = await fetch(`/api/products`);
      const all = await rel.json();
      setRelatedProducts(
        all.filter((p: any) => p.category === data.category && p.id !== data.id)
      );
    } catch (err) {
      console.error(err);
      setProduct(null);
    }
  };

  loadProduct();
}, [id]);

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem", minHeight: "60vh" }}>
        <h1>Producto no encontrado</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/shop")}
          style={{ marginTop: "2rem" }}
        >
          Volver a tienda
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    setModal({
      isOpen: true,
      type: "prompt",
      title: "Cantidad",
      message: `¿Cuántas unidades de ${product.name} deseas agregar?`,
      inputPlaceholder: "1",
    });
  };

  const handleModalConfirm = (value?: string) => {
    const qty = parseInt(value || "1", 10);
    if (isNaN(qty) || qty <= 0) {
      setModal({
        isOpen: true,
        type: "alert" as const,
        title: "Error",
        message: "Ingresa una cantidad válida",
      });
      return;
    }

    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }

    setModal({ ...modal, isOpen: false });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleModalCancel = () => {
    setModal({ ...modal, isOpen: false });
  };

  // relatedProducts state is populated by effect above

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "5rem" }}>
      <div className="container" style={{ paddingTop: "3rem" }}>
        {/* Back button */}
        <button
          onClick={() => router.push("/shop")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#7C9A8E",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            textDecoration: "underline",
          }}
        >
          ← Volver a tienda
        </button>

        {/* Product Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
          {/* Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>

          {/* Details */}
          <div>
            <span style={{ fontSize: "0.85rem", color: "#7C9A8E", textTransform: "uppercase" }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: "2.5rem", marginTop: "0.5rem", marginBottom: "1rem" }}>
              {product.name}
            </h1>

            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontSize: "2rem", color: "#9FB3A1", fontWeight: "600" }}>
                ${product.price.toFixed(2)} MXN
              </p>
            </div>

            <p style={{ fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "2rem", color: "#666" }}>
              {product.description}
            </p>

            <button
              className={`btn ${added ? "btn-outline" : "btn-primary"}`}
              onClick={handleAddToCart}
              disabled={added}
              style={{ padding: "1rem 2rem", fontSize: "1rem" }}
            >
              {added ? "✓ Agregado al carrito" : "Agregar al carrito"}
            </button>

            {/* Product Info */}
            <div
              style={{
                marginTop: "3rem",
                padding: "2rem",
                backgroundColor: "#F6F3EF",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#2E2E2E" }}>Información del Producto</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center" }}>
                  <span style={{ color: "#7C9A8E", marginRight: "0.75rem" }}>🌱</span>
                  <span>100% Orgánico y Natural</span>
                </li>
                <li style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center" }}>
                  <span style={{ color: "#7C9A8E", marginRight: "0.75rem" }}>♻️</span>
                  <span>Eco-amigable y Sostenible</span>
                </li>
                <li style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center" }}>
                  <span style={{ color: "#7C9A8E", marginRight: "0.75rem" }}>💚</span>
                  <span>Libre de Crueldad Animal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ borderTop: "2px solid #E5E5E5", paddingTop: "3rem" }}>
            <h2 style={{ marginBottom: "2rem", fontSize: "1.8rem", textAlign: "center" }}>
              Productos Relacionados
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "2rem",
              }}
            >
              {relatedProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/shop/${p.id}`)}
                  style={{
                    background: "white",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "1rem" }}>
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>{p.name}</h3>
                    <p style={{ color: "#7C9A8E", fontWeight: "600" }}>${p.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Portal>
        <Modal
          isOpen={modal.isOpen}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          inputPlaceholder={modal.inputPlaceholder}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      </Portal>
    </div>
  );
}

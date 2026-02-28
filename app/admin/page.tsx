"use client";

import { Product } from "@/types/product";
import { useState, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import dynamic from "next/dynamic";

const Modal = dynamic(() => import("@/components/Modal"), { ssr: false });
const Portal = dynamic(() => import("@/components/Portal"), { ssr: false });

export default function AdminDashboard() {
  const { isLoggedIn, login, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "guide">("orders");
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "alert" | "prompt";
    title: string;
    message: string;
    inputPlaceholder: string;
  }>({
    isOpen: !isLoggedIn,
    type: "prompt",
    title: "🔐 Admin Login",
    message: "Ingresa la contraseña para acceder al panel de administración:",
    inputPlaceholder: "Contraseña",
  });
  const [loginError, setLoginError] = useState("");

  // Show login modal if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setModal(prev => ({
        ...prev,
        isOpen: true,
      }));
    }
  }, [isLoggedIn]);

  const handleLoginSubmit = (password?: string) => {
    // always show the prompt modal; if there's an error, re‑display it with message
    if (!password) {
      setModal({
        isOpen: true,
        type: "prompt",
        title: "🔐 Admin Login",
        message: "La contraseña no puede estar vacía",
        inputPlaceholder: "Contraseña",
      });
      return;
    }

    if (login(password)) {
      setModal({ isOpen: false, type: "prompt", title: "", message: "", inputPlaceholder: "" });
      setLoginError("");
    } else {
      setModal({
        isOpen: true,
        type: "prompt",
        title: "🔐 Admin Login",
        message: "Contraseña incorrecta. Intenta de nuevo.",
        inputPlaceholder: "Contraseña",
      });
    }
  };

  const handleModalCancel = () => {
    if (!isLoggedIn) {
      // ignore cancel when not logged in
      return;
    }
    setModal({ isOpen: false, type: "prompt", title: "", message: "", inputPlaceholder: "" });
  };

  // product management state (will be loaded from API)
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "">("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });

  // when editingProduct changes, populate form
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price.toString(),
        image: editingProduct.image,
        description: editingProduct.description,
      });
    } else {
      setFormData({ name: "", category: "", price: "", image: "", description: "" });
    }
  }, [editingProduct]);

  // load products when admin logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/products")
        .then(res => res.json())
        .then((data: any) => {
          // ensure id field is string number or ObjectId
          setProducts(data);
        })
        .catch(err => console.error("Failed to fetch products", err));
    }
  }, [isLoggedIn]);

  // always render login modal (overlay) when not authenticated
  if (!isLoggedIn) {
    return (
      <>
        <Portal>
          <Modal
            isOpen={true}                    // force open until logged in
            type={modal.type}
            title={modal.title}
            message={modal.message}
            inputPlaceholder={modal.inputPlaceholder}
            onConfirm={handleLoginSubmit}
            onCancel={handleModalCancel}      // noop when not logged
          />
        </Portal>
      </>
    );
  }


  const categories = Array.from(new Set(products.map(p => p.category)));
  const categoryStats = categories.map(cat => ({
    category: cat,
    count: products.filter(p => p.category === cat).length,
    avgPrice: (
      products
        .filter(p => p.category === cat)
        .reduce((sum, p) => sum + p.price, 0) / products.filter(p => p.category === cat).length
    ).toFixed(2),
  }));

  const totalProducts = products.length;
  const avgPrice = totalProducts ? (products.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(2) : "0";
  const priceRange = {
    min: totalProducts ? Math.min(...products.map(p => p.price)) : 0,
    max: totalProducts ? Math.max(...products.map(p => p.price)) : 0,
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      minHeight: "100vh",
      backgroundColor: "#F6F3EF",
    },
    header: {
      marginBottom: "2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: "2rem",
      color: "#2E2E2E",
      marginBottom: "0.5rem",
    },
    subtitle: {
      color: "#666",
      fontSize: "0.95rem",
    },
    logoutBtn: {
      padding: "0.6rem 1.2rem",
      backgroundColor: "#E74C3C",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "500",
      transition: "all 0.3s",
    },
    tabs: {
      display: "flex",
      gap: "1rem",
      marginBottom: "2rem",
      borderBottom: "2px solid #ddd",
    },
    tabButton: {
      padding: "0.75rem 1.5rem",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      color: "#666",
      borderBottom: "3px solid transparent",
      transition: "all 0.3s",
    },
    tabButtonActive: {
      color: "#7C9A8E",
      borderBottomColor: "#7C9A8E",
    },
    card: {
      background: "white",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    statCard: {
      background: "white",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: "600",
      color: "#7C9A8E",
      marginBottom: "0.5rem",
    },
    statLabel: {
      color: "#666",
      fontSize: "0.9rem",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
    },
    th: {
      textAlign: "left" as const,
      padding: "1rem",
      backgroundColor: "#F6F3EF",
      color: "#2E2E2E",
      fontWeight: "600",
      borderBottom: "2px solid #ddd",
    },
    td: {
      padding: "1rem",
      borderBottom: "1px solid #eee",
    },
    badge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      backgroundColor: "#E8F3F0",
      color: "#7C9A8E",
    },
  };

  return (
    <div style={styles.container as any}>
      <div style={styles.header as any}>
        <div style={styles.headerContent}>
          <h1 style={styles.title as any}>📊 Panel de Administración</h1>
          <p style={styles.subtitle}>Amar a Gaia - Dashboard de Productos</p>
        </div>
        <button
          onClick={logout}
          style={styles.logoutBtn}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#C0392B")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#E74C3C")}
        >
          ✕ Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs as any}>
        {["overview", "products", "guide"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              ...(styles.tabButton as any),
              ...(activeTab === tab && (styles.tabButtonActive as any)),
            }}
          >
            {tab === "orders" && "🧾 Orders"}
            {tab === "products" && "🛍️ Productos"}
            {tab === "guide" && "📖 Guía"}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
{activeTab === "orders" && (
        <>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <h2>🧾 Actividad de Ventas</h2>
            <p style={{ color: "#666" }}>
              Los datos de ventas y órdenes aparecerán aquí una vez que el sistema de pedidos esté
              disponible. Por ahora puedes ver el listado de productos y realizar pruebas creando
              órdenes manualmente desde la base de datos.
            </p>
          </div>
        </>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div style={styles.card as any}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1.5rem", color: "#2E2E2E" }}>
            Catálogo Completo
          </h2>

          {/* search / filter bar */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="btn btn-outline"
            >Limpiar</button>
          </div>

          {/* add / edit form */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3>{editingProduct ? "Editar producto" : "Añadir producto"}</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                const name = formData.name.trim();
                const category = formData.category.trim();
                const price = parseFloat(formData.price);
                const image = formData.image.trim();
                const description = formData.description.trim();
                if (!name || !category || isNaN(price)) return;

                if (editingProduct) {
                  const updated = { name, category, price, image, description };
                  fetch(`/api/products/${editingProduct.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updated),
                  }).then(() => {
                    setProducts(prev =>
                      prev.map(p => (p.id === editingProduct.id ? { ...p, ...updated } : p))
                    );
                    setEditingProduct(null);
                  });
                } else {
                  fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, category, price, image, description }),
                  })
                    .then(res => res.json())
                    .then(newProd => {
                      setProducts(prev => [...prev, newProd]);
                    })
                    .catch(err => console.error("create failed", err));
                }
                // reset form state
                setFormData({ name: "", category: "", price: "", image: "", description: "" });
              }}
            >
              <input
                name="name"
                placeholder="Nombre"
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                name="category"
                placeholder="Categoría"
                required
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
              <input
                name="price"
                type="number"
                placeholder="Precio"
                step="0.01"
                required
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
              <input
                name="image"
                placeholder="URL de imagen"
                value={formData.image}
                onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
              <input
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              <button className="btn btn-primary" type="submit" style={{ marginLeft: "0.5rem" }}>
                {editingProduct ? "Guardar" : "Agregar"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => setEditingProduct(null)}
                >Cancelar</button>
              )}
            </form>
          </div>

          <table style={styles.table as any}>
            <thead>
              <tr>
                <th style={styles.th as any}>ID</th>
                <th style={styles.th as any}>Nombre</th>
                <th style={styles.th as any}>Categoría</th>
                <th style={styles.th as any}>Precio</th>
                <th style={styles.th as any}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(p => {
                  if (searchTerm) {
                    const term = searchTerm.toLowerCase();
                    if (!p.name.toLowerCase().includes(term) && !p.description.toLowerCase().includes(term)) {
                      return false;
                    }
                  }
                  if (selectedCategory && p.category !== selectedCategory) return false;
                  return true;
                })
                .map(product => (
                  <tr key={product.id}>
                    <td style={styles.td as any}>#{product.id}</td>
                    <td style={styles.td as any}>{product.name}</td>
                    <td style={styles.td as any}>
                      <span style={styles.badge as any}>{product.category}</span>
                    </td>
                    <td style={{ ...(styles.td as any), fontWeight: "600", color: "#7C9A8E" }}>
                      ${product.price}
                    </td>
                    <td style={styles.td as any}>
                      <button
                        className="btn btn-outline"
                        onClick={() => setEditingProduct(product)}
                        style={{ marginRight: "0.5rem" }}
                      >Editar</button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          if (confirm("Eliminar producto?")) {
                            fetch(`/api/products/${product.id}`, { method: "DELETE" })
                              .then(() => {
                                setProducts(prev => prev.filter(p => p.id !== product.id));
                              })
                              .catch(err => console.error("delete failed", err));
                          }
                        }}
                      >Eliminar</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GUIDE TAB */}
      {activeTab === "guide" && (
        <div style={styles.card as any}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1.5rem", color: "#2E2E2E" }}>
            📖 Guía de Administración
          </h2>

          <div style={{ lineHeight: "1.8", color: "#666" }}>
            <h3 style={{ color: "#2E2E2E", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              ✅ Estado Actual del Proyecto
            </h3>
            <ul style={{ marginLeft: "1.5rem" }}>
              <li>✓ Base de datos de {totalProducts} productos</li>
              <li>✓ Página de detalles de producto individual</li>
              <li>✓ Búsqueda y filtrado por categoría</li>
              <li>✓ Carrito de compras con localStorage</li>
              <li>✓ Sistema de modales profesional</li>
              <li>✓ API para formulario de contacto</li>
              <li>✓ Integración con Magicloops para emails</li>
              <li>✓ Login protegido para admin</li>
            </ul>

            <h3 style={{ color: "#2E2E2E", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              🚀 Próximos Pasos Sugeridos
            </h3>
            <ul style={{ marginLeft: "1.5rem" }}>
              <li><strong>Pagos:</strong> Integrar Stripe o PayPal para procesar pagos reales</li>
              <li><strong>Órdenes:</strong> Base de datos para guardar historial de órdenes</li>
              <li><strong>Usuarios:</strong> Sistema de autenticación y cuentas de cliente</li>
              <li><strong>Imágenes:</strong> Subir imágenes reales de productos a Cloudinary</li>
              <li><strong>Reviews:</strong> Permitir que clientes dejen comentarios</li>
              <li><strong>Inventario:</strong> Rastrear stock disponible por producto</li>
            </ul>

            <h3 style={{ color: "#2E2E2E", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              🔐 Login Seguro
            </h3>
            <p style={{ marginLeft: "1.5rem", marginBottom: "1rem" }}>
              El panel de administración está protegido con contraseña. <strong>Contraseña actual:</strong> <code style={{ backgroundColor: "#F0F0F0", padding: "0.25rem 0.5rem", borderRadius: "3px" }}>AmarAGaia2024</code>
            </p>

            <h3 style={{ color: "#2E2E2E", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              📁 Estructura de Archivos
            </h3>
            <ul style={{ marginLeft: "1.5rem", fontSize: "0.95rem", fontFamily: "monospace" }}>
              <li>data/products.ts - Catálogo de {totalProducts} productos</li>
              <li>app/shop/page.tsx - Tienda con búsqueda y filtros</li>
              <li>app/shop/[id]/page.tsx - Detalles de producto</li>
              <li>app/admin/page.tsx - Dashboard protegido</li>
              <li>context/AdminAuthContext.tsx - Autenticación</li>
              <li>components/Modal.tsx - Modales profesionales</li>
              <li>context/CartContext.tsx - Gestión de carrito</li>
            </ul>

            <h3 style={{ color: "#2E2E2E", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              💡 Características Únicas
            </h3>
            <ul style={{ marginLeft: "1.5rem" }}>
              <li>Diseño sustentable y eco-friendly</li>
              <li>Productos veganos y cruelty-free</li>
              <li>Interfaz moderna y responsiva</li>
              <li>Sistema de carrito persistente</li>
              <li>Integración directa con correo</li>
              <li>Admin panel seguro con login modal</li>
            </ul>

            <p
              style={{
                marginTop: "2rem",
                padding: "1rem",
                backgroundColor: "#E8F3F0",
                borderRadius: "6px",
                color: "#7C9A8E",
              }}
            >
              <strong>💚 ¡Tu tienda Amar a Gaia está lista para crecer!</strong> El panel de administración está protegido. Cambia la contraseña editando <code>context/AdminAuthContext.tsx</code>.
            </p>
          </div>
        </div>
      )}

      <Portal>
        <Modal
          isOpen={modal.isOpen}
          type={modal.type as "alert" | "prompt"}
          title={modal.title}
          message={modal.message}
          inputPlaceholder={modal.inputPlaceholder}
          onConfirm={handleLoginSubmit}
          onCancel={handleModalCancel}
        />
      </Portal>
    </div>
  );
}

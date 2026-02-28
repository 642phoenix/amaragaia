"use client";

import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";

const CheckoutButton = dynamic(() => import("@/components/CheckoutButton"), { ssr: false });

export default function CartPage() {
  const { cart, updateQuantity, getTotal, clearCart } = useCart();

  return (
    <section className="cart-page container">
      <h1>Mi carrito</h1>
      {cart.length === 0 && <p>El carrito está vacío.</p>}
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div className="cart-item-info">
            <h4>{item.name}</h4>
            <p>${item.price}</p>
            <input
              type="number"
              min="0"
              value={item.quantity}
              onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
            />
            <button
              className="btn btn-outline"
              style={{ marginTop: "0.5rem" }}
              onClick={() => updateQuantity(item.id, 0)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
      {cart.length > 0 && (
        <>
          <div className="cart-total">
            <strong>Total: ${getTotal()}</strong>
          </div>
          <button className="btn btn-outline" onClick={clearCart} style={{ marginTop: "1rem" }}>
            Vaciar carrito
          </button>
          {/* checkout button client-only */}
          <div style={{ marginTop: "1.5rem" }}>
            <CheckoutButton />
          </div>
        </>
      )}
    </section>
  );
}
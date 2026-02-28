"use client";

import { useCart } from "@/context/CartContext";

interface CartModalProps {
  onClose: () => void;
}

export default function CartModal({ onClose }: CartModalProps) {
  const { cart, updateQuantity, getTotal, clearCart } = useCart();

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Carrito</h2>
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
                style={{marginTop:'0.5rem'}}
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
            <button className="btn btn-outline" onClick={clearCart} style={{marginTop:'1rem'}}>
              Vaciar carrito
            </button>
          </>
        )}
      </div>
    </div>
  );
}
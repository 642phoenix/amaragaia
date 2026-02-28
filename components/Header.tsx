"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartModal from "./CartModal";

export default function Header() {
  const { getCount, getTotal } = useCart();
  const [show, setShow] = useState(false);

  return (
    <header className="navbar container">
      <nav>
        <Link href="/" className="logo">
          AMAR A GAIA
        </Link>
        <ul className="nav-menu">
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/shop">Tienda</Link>
          </li>
          <li>
            <Link href="/contact">Contacto</Link>
          </li>
          <li>
            <Link href="/cart">Carrito</Link>
          </li>
        </ul>
      </nav>
      <button
        className="btn cart-btn"
        onClick={() => setShow(true)}
        title={`Artículos: ${getCount()}, Total: $${getTotal().toFixed(2)}`}
      >
        <i className="fas fa-shopping-cart"></i> {getCount()} • ${getTotal().toFixed(2)}
      </button>
      {show && <CartModal onClose={() => setShow(false)} />}
    </header>
  );
}
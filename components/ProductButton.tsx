"use client";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Modal from "./Modal";
import Portal from "./Portal";

export default function ProductButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
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
    message: "¿Cuántas unidades deseas agregar?",
    inputPlaceholder: "1",
  });

  const handle = () => {
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
        type: "alert",
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

  return (
    <>
      <button
        className={`btn ${added ? "btn-outline" : "btn-primary"}`}
        onClick={handle}
        disabled={added}
      >
        {added ? "Agregado ✓" : "Agregar pedido"}
      </button>
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
    </>
  );
}
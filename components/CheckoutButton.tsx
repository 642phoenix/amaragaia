"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Modal from "./Modal";
import Portal from "./Portal";

type ModalState = {
  isOpen: boolean;
  type: "alert" | "confirm" | "prompt";
  title: string;
  message: string;
  inputPlaceholder?: string;
};

export default function CheckoutButton() {
  const { cart, getTotal, clearCart } = useCart();
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
  });

  const [step, setStep] = useState<"idle" | "name" | "contact" | "confirm">("idle");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const startCheckout = () => {
    setStep("name");
    setModal({
      isOpen: true,
      type: "prompt",
      title: "Nombre",
      message: "Ingresa tu nombre para el pedido:",
      inputPlaceholder: "Tu nombre",
    });
  };

  const handleModalConfirm = (value?: string) => {
    if (step === "name") {
      if (!value || value.trim() === "") {
        setModal({
          isOpen: true,
          type: "prompt",
          title: "Nombre",
          message: "El nombre es obligatorio",
          inputPlaceholder: "Tu nombre",
        });
        setStep("name");
        return;
      }
      setName(value);
      setStep("contact");
      setModal({
        isOpen: true,
        type: "prompt",
        title: "Contacto",
        message: "Ingresa tu WhatsApp o email para seguimiento:",
        inputPlaceholder: "WhatsApp o Email",
      });
    } else if (step === "contact") {
      if (!value || value.trim() === "") {
        setModal({
          isOpen: true,
          type: "prompt",
          title: "Contacto",
          message: "Necesitamos al menos un WhatsApp o email",
          inputPlaceholder: "WhatsApp o Email",
        });
        setStep("contact");
        return;
      }
      setContact(value);
      setStep("confirm");
      setModal({
        isOpen: true,
        type: "confirm",
        title: "Confirmar Pedido",
        message: `Nombre: ${name}\nContacto: ${value}\nTotal: $${getTotal().toFixed(2)}\n\n¿Deseas confirmar y enviar el pedido?`,
      });
    } else if (step === "confirm") {
      sendOrder(name, contact);
    }
  };

  const handleModalCancel = () => {
    // only reset back to idle if we're not in the middle of a prompt sequence
    if (step === "confirm" || step === "idle") {
      setModal({ ...modal, isOpen: false });
      setStep("idle");
      setName("");
      setContact("");
    } else {
      // if user cancels during name/contact input we just close the modal but keep step so
      // they can start again later
      setModal({ ...modal, isOpen: false });
    }
  };

  const sendOrder = async (orderName: string, orderContact: string) => {
    const payload = {
      name: orderName,
      contact: orderContact,
      items: cart.map(i => `${i.name} x${i.quantity}`).join("\n"),
      total: getTotal().toFixed(2),
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setModal({ isOpen: false, type: "alert", title: "", message: "" });
    setStep("idle");

    if (res.ok) {
      setModal({
        isOpen: true,
        type: "alert",
        title: "Éxito",
        message: "Pedido enviado exitosamente 🌱",
      });
      clearCart();
      setName("");
      setContact("");
    } else {
      setModal({
        isOpen: true,
        type: "alert",
        title: "Error",
        message: "Error al enviar el pedido",
      });
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={startCheckout}>
        Place Order
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
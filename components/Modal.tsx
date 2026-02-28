"use client";

import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: "alert" | "confirm" | "prompt";
  inputPlaceholder?: string;
  inputDefaultValue?: string;
  onConfirm: (value?: string) => void;
  onCancel: () => void;
}

export default function Modal({
  isOpen,
  title,
  message,
  type,
  inputPlaceholder,
  inputDefaultValue,
  onConfirm,
  onCancel,
}: ModalProps) {
  const [inputValue, setInputValue] = useState(inputDefaultValue || "");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === "prompt") {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
    setInputValue("");
  };

  const handleCancel = () => {
    onCancel();
    setInputValue("");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>

        {type === "prompt" && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            style={styles.input}
          />
        )}

        <div style={styles.buttonContainer}>
          {type !== "alert" && (
            <button onClick={handleCancel} style={{ ...styles.button, ...styles.cancelBtn }}>
              Cancelar
            </button>
          )}
          <button onClick={handleConfirm} style={{ ...styles.button, ...styles.confirmBtn }}>
            {type === "alert" ? "OK" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    width: "100%",
    height: "100%",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "2rem",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    position: "relative" as const,
    zIndex: 100000,
  },
  title: {
    margin: "0 0 1rem 0",
    color: "#2E2E2E",
    fontSize: "1.25rem",
  },
  message: {
    margin: "0 0 1.5rem 0",
    color: "#666",
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "0.95rem",
    boxSizing: "border-box" as const,
  },
  buttonContainer: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
  },
  button: {
    padding: "0.6rem 1.2rem",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "all 0.3s ease",
  },
  confirmBtn: {
    backgroundColor: "#7C9A8E",
    color: "white",
  },
  cancelBtn: {
    backgroundColor: "#f0f0f0",
    color: "#333",
  },
};
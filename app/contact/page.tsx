"use client"
import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        setStatus("Mensaje enviado, gracias!");
        form.reset();
      } else {
        const text = await res.text().catch(() => "");
        setStatus(`Error al enviar el mensaje. ${text}`);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setStatus("Tiempo de espera agotado. Intenta de nuevo.");
      } else {
        console.error(err);
        setStatus("Error al enviar el mensaje.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact container">
      <h2 className="section-title">Contacto</h2>
      <p>
        ¿Tienes preguntas o comentarios? Escríbenos a{' '}
        <a href="mailto:danialavegna@gmail.com">info@amaragaia.com</a> o utiliza el
        siguiente formulario:
      </p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Mensaje:
          <textarea name="message" rows={4} required />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </section>
  );
}
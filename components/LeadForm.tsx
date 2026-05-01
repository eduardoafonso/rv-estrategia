"use client";

import { useState } from "react";

type FormState = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

export default function LeadForm() {
    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    function isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSuccess(false);

        if (!form.name || !form.email || !form.message) {
            alert("Preencha os campos obrigatórios.");
            return;
        }

        if (!isValidEmail(form.email)) {
            alert("Email inválido.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/lead", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Erro ao enviar");

            setSuccess(true);
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (err) {
            alert("Erro ao enviar formulário.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md flex flex-col space-y-4"
        >
            <input
                name="name"
                placeholder="Nome"
                value={form.name}
                onChange={handleChange}
                className="w-full block border p-2"
            />

            <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2"
            />

            <input
                name="phone"
                placeholder="Telefone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-2"
            />

            <textarea
                name="message"
                placeholder="Mensagem"
                value={form.message}
                onChange={handleChange}
                className="w-full border p-2"
                rows={4}
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white p-2"
            >
                {loading ? "Enviando..." : "Enviar"}
            </button>

            {success && (
                <p className="text-green-600">
                    Mensagem enviada com sucesso!
                </p>
            )}
        </form>
    );
}
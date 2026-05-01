"use client";

import { useRef, useState } from "react";
import { leadSchema } from "@/lib/lead-schema";
import { maskPhone } from "@/lib/phone-mask";
import FeedbackModal from "./FeedbackModal";

type FieldErrors = {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
};

export default function LeadForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const [errors, setErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] =
        useState<"success" | "error">("success");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    function validate(data: any) {
        const result = leadSchema.safeParse(data);

        if (!result.success) {
            const fieldErrors: FieldErrors = {};

            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof FieldErrors;
                fieldErrors[field] = err.message;
            });

            return fieldErrors;
        }

        return {};
    }

    function handleBlur(
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name } = e.target;

        setTouched((p) => ({ ...p, [name]: true }));

        const form = formRef.current;
        if (!form) return;

        const data = Object.fromEntries(new FormData(form));
        setErrors(validate(data));
    }

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name } = e.target;

        if (errors[name as keyof FieldErrors]) {
            setErrors((p) => ({ ...p, [name]: undefined }));
        }
    }

    function trackLead() {
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "generate_lead", {
                event_category: "lead",
                event_label: "landing_form",
            });
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        const data = Object.fromEntries(new FormData(form));

        const validation = validate(data);

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                setModalType("error");
                setModalTitle("Erro ao enviar");
                setModalMessage(
                    "Não foi possível enviar. Tente novamente."
                );
                setModalOpen(true);
                return;
            }

            trackLead();

            form.reset();

            setErrors({});
            setTouched({});

            setModalType("success");
            setModalTitle("Solicitação enviada!");
            setModalMessage(
                "Recebemos seu pedido. Em breve entraremos em contato."
            );
            setModalOpen(true);
        } finally {
            setLoading(false);
        }
    }

    const inputClass = (field: keyof FieldErrors) =>
        `border p-3 w-full rounded ${touched[field] && errors[field]
            ? "border-red-500"
            : "border-gray-300"
        }`;

    return (
        <>
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="w-full max-w-md flex flex-col gap-4"
            >
                <div className="text-center">
                    <h2 className="text-xl font-bold">
                        Diagnóstico gratuito
                    </h2>
                    <p className="text-sm text-gray-500">
                        Resposta em até 24h
                    </p>
                </div>

                <input
                    name="name"
                    placeholder="Nome *"
                    className={inputClass("name")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {touched.name && errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                )}

                <input
                    name="email"
                    placeholder="Email *"
                    className={inputClass("email")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {touched.email && errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                <input
                    name="phone"
                    placeholder="WhatsApp"
                    className={inputClass("phone")}
                    onChange={(e) => {
                        e.target.value = maskPhone(e.target.value);
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                />

                <textarea
                    name="message"
                    placeholder="Objetivo *"
                    rows={4}
                    className={inputClass("message")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {touched.message && errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                )}

                <button
                    disabled={loading}
                    className="bg-black text-white p-3 rounded font-semibold"
                >
                    {loading ? "Enviando..." : "Quero meu diagnóstico →"}
                </button>
            </form>

            <FeedbackModal
                open={modalOpen}
                type={modalType}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}
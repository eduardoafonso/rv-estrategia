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

    // refs para foco automático
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const fieldRefs: Record<string, any> = {
        name: nameRef,
        email: emailRef,
        phone: phoneRef,
        message: messageRef,
    };

    const [errors, setErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    // modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] =
        useState<"success" | "error">("success");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    // validação central
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

    // blur validation
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

    // limpa erro ao digitar
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name } = e.target;

        if (errors[name as keyof FieldErrors]) {
            setErrors((p) => ({ ...p, [name]: undefined }));
        }
    }

    // GA4 tracking
    function trackLead() {
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "generate_lead", {
                event_category: "lead",
                event_label: "landing_form",
            });
        }
    }

    // submit
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        const data = Object.fromEntries(new FormData(form));

        const validation = validate(data);

        if (Object.keys(validation).length > 0) {
            setErrors(validation);

            // foco automático no primeiro erro
            const firstError = Object.keys(validation)[0];
            fieldRefs[firstError]?.current?.focus();

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
                setModalMessage("Tente novamente em instantes.");
                setModalOpen(true);
                return;
            }

            trackLead();

            form.reset();

            setErrors({});
            setTouched({});

            setModalType("success");
            setModalTitle("Solicitação enviada!");
            setModalMessage("Em breve entraremos em contato.");
            setModalOpen(true);
        } finally {
            setLoading(false);
        }
    }

    // input style (valid / invalid + shake)
    const inputClass = (field: keyof FieldErrors) => {
        const hasError = touched[field] && errors[field];
        const isValid = touched[field] && !errors[field];

        return `border p-3 w-full rounded transition outline-none
      ${hasError ? "border-red-500 shake" : ""}
      ${isValid ? "border-green-500" : "border-gray-300"}
    `;
    };

    return (
        <>
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="w-full max-w-md flex flex-col gap-4"
            >
                <div className="text-center">
                    <h2 className="text-xl font-bold">
                        Diagnóstico estratégico gratuito
                    </h2>
                    <p className="text-sm text-gray-500">
                        Resposta em até 24h
                    </p>
                </div>

                {/* NAME */}
                <input
                    ref={nameRef}
                    name="name"
                    placeholder="Nome *"
                    className={inputClass("name")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {touched.name && errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                )}

                {/* EMAIL */}
                <input
                    ref={emailRef}
                    name="email"
                    placeholder="Email *"
                    className={inputClass("email")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {touched.email && errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                {/* PHONE */}
                <input
                    ref={phoneRef}
                    name="phone"
                    placeholder="WhatsApp"
                    className={inputClass("phone")}
                    onChange={(e) => {
                        e.target.value = maskPhone(e.target.value);
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                />

                {/* MESSAGE */}
                <textarea
                    ref={messageRef}
                    name="message"
                    placeholder="Seu objetivo *"
                    rows={4}
                    className={inputClass("message")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {touched.message && errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                )}

                {/* CTA */}
                <button
                    disabled={loading}
                    className="bg-black text-white p-3 rounded font-semibold hover:bg-gray-800 transition"
                >
                    {loading ? "Enviando..." : "Quero meu diagnóstico →"}
                </button>
            </form>

            {/* MODAL */}
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
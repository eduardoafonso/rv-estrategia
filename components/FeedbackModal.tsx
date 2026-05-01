"use client";

import { useEffect } from "react";

type Props = {
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onClose: () => void;
};

export default function FeedbackModal({
    open,
    type,
    title,
    message,
    onClose,
}: Props) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    if (!open) return null;

    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* modal */}
            <div className="relative bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
                <h2
                    className={`text-lg font-bold ${isSuccess ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {title}
                </h2>

                <p className="text-gray-700 mt-2">{message}</p>

                {isSuccess && (
                    <p className="text-sm text-gray-500 mt-3">
                        Em breve entraremos em contato com você.
                    </p>
                )}

                <button
                    onClick={onClose}
                    className={`mt-5 w-full p-2 rounded text-white ${isSuccess
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-black hover:bg-gray-800"
                        }`}
                >
                    Fechar
                </button>
            </div>
        </div>
    );
}
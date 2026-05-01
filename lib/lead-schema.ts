import { z } from "zod";

export const leadSchema = z.object({
    name: z.string().min(2, "Nome obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z
        .string()
        .optional()
        .refine(
            (val) =>
                !val ||
                /\(\d{2}\)\s\d{4,5}-\d{4}/.test(val),
            "Telefone inválido"
        ),
    message: z.string().min(5, "Mensagem obrigatória"),
});

export type LeadInput = z.infer<typeof leadSchema>;
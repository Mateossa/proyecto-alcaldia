import { z } from "zod"

export const loginSchema = z.object({
    email: z
        .string()
        .email("Ingrese un email valido"),

    password: z
        .string()
        .min(8, "Debe tener al menos 6 caracteres")
        // .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        // .regex(/[0-9]/, "Debe contener al menos un número")

 
})
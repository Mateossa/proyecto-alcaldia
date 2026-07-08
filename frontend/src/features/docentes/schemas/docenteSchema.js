import { z } from "zod";

export const docenteSchema = z.object({
    nombreServidor: z.string().min(3, "El nombre es obligatorio"),
    tipoIdentificacion: z.enum(["CC","TI","CE"], { required_error: "Seleccione un tipo de identificación" }),
    numeroIdentificacion: z.string().regex(/^\d+$/, "Debe ser un número válido"),
    institucionEducativa: z.string().min(3, "La institución es obligatoria"),
    sedeCentral: z.string().min(3, "La sede es obligatoria"),
    fechaInicio: z.string().nonempty("La fecha de inicio es obligatoria"),
    fechaFin: z.string().nonempty("La fecha de fin es obligatoria"),
    horaInicio: z.string().nonempty("La hora de inicio es obligatoria"),
    horaFin: z.string().nonempty("La hora de fin es obligatoria"),
    tipoPermiso: z.string().nonempty("Seleccione un tipo de permiso"),
    justificacion: z.string().min(10, "La justificación debe tener al menos 10 caracteres"),
    soporte: z.any().refine((file) => file !== null, {
        message: "Debe adjuntar un soporte en PDF o imagen"
    })
});

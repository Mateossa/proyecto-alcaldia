import { docentes } from "@/data/docentes/docentes.js";

export const getDocenteById = (id) => {
  return docentes.find(docente => docente.id == id);
};

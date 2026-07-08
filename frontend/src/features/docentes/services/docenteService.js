import axios from "axios";

// API base para docentes
const docentesApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/docentes/"
});

// Obtener todos los registros de ausentismo (docentes)
export const getAllDocentes = async () => {
  const response = await docentesApi.get("/");
  return response.data;
};

// Obtener un docente por ID
export const getDocenteById = async (id) => {
  const response = await docentesApi.get(`/${id}/`);
  return response.data;
};

// Crear un nuevo registro de docente
export const createDocente = async (docente) => {
  const response = await docentesApi.post("/", docente);
  return response.data;
};

// Actualizar un registro de docente
export const updateDocente = async (id, docente) => {
  const response = await docentesApi.put(`/${id}/`, docente);
  return response.data;
};

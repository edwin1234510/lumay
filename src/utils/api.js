import { alertaError } from "../componentes/sweetAlert";

/**
 * URL base de la API del backend.
 * 
 * Todas las peticiones HTTP se construyen a partir de esta constante,
 * concatenando el `endpoint` correspondiente.
 */
const API_URL = "http://localhost:8080/LumayJava/api/";

/**
 * Realiza una petición HTTP GET autenticada a la API.
 * 
 * - Incluye el token de acceso en el header `Authorization`.
 * - Si el token expiró (`401`), intenta refrescarlo y reintenta la petición.
 * - Si la respuesta es `403`, muestra un error de permisos y lanza excepción.
 * - Intenta parsear la respuesta en JSON, retorna `[]` si falla.
 * 
 * @async
 * @param {string} endpoint - Ruta de la API a consultar (ej: `"clientes/listar"`).
 * @returns {Promise<Object|Array>} Respuesta en formato JSON o array vacío si no se puede parsear.
 */
export const get = async (endpoint) => {
  let res = await fetch(API_URL + endpoint, {
    headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` }
  });

  //  Si el token expiró → refrescar y reintentar
  if (res.status === 401) {
    await refreshAccessToken();
    res = await fetch(API_URL + endpoint, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` }
    });
  }

  //  Si el usuario no tiene permisos → mostrar error
  if (res.status === 403) {
    alertaError("No tienes permisos para acceder a esta sección");
    throw new Error("Forbidden");
  }

  //  Retornar JSON si es válido, o un array vacío si no se pudo parsear
  const data = await res.json().catch(() => []);
  return data;
};

/**
 * Realiza una petición HTTP POST con JSON.
 * 
 * - Incluye el token de acceso si existe en `localStorage`.
 * - Envía el cuerpo en formato `application/json`.
 * 
 * @async
 * @param {string} endpoint - Ruta de la API donde enviar los datos.
 * @param {Object} info - Objeto con los datos a enviar.
 * @returns {Promise<Response>} Respuesta completa de `fetch`.
 */
export const post = async (endpoint, info) => {
  const token = localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(API_URL + endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(info)
  });
};

/**
 * Realiza una petición HTTP POST con `FormData`.
 * 
 * - Útil para subir archivos o formularios con imágenes/documentos.
 * - Incluye token en `Authorization`.
 * - Si el token expiró, intenta refrescarlo y reintentar.
 * 
 * @async
 * @param {string} endpoint - Ruta de la API.
 * @param {FormData} formData - Datos en formato `FormData` a enviar.
 * @returns {Promise<Response>} Respuesta completa de `fetch`.
 */
export const postFormData = async (endpoint, formData) => {
  let res = await fetch(API_URL + endpoint, {
    method: "POST",
    body: formData,
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    }
  });

  //  Intentar refrescar si expiró el token
  if (res.status === 401) {
    await refreshAccessToken();
    res = await fetch(API_URL + endpoint, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
  }

  return res;
};

/**
 * Realiza una petición HTTP PUT para actualizar recursos.
 * 
 * - Envía datos en JSON.
 * - Maneja la expiración del token y reintenta automáticamente.
 * - Retorna el JSON de la respuesta.
 * - Lanza error si la respuesta no es `ok`.
 * 
 * @async
 * @param {string} endpoint - Ruta de la API.
 * @param {Object} info - Datos a actualizar.
 * @returns {Promise<Object>} Respuesta de la API en JSON.
 * @throws {Error} Si la API devuelve error o status distinto de `2xx`.
 */
export const put = async (endpoint, info) => {
  let res = await fetch(API_URL + endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(info)
  });

  //  Si el token expiró, refrescar e intentar de nuevo
  if (res.status === 401) {
    await refreshAccessToken();
    res = await fetch(API_URL + endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(info)
    });
  }

  //  Parsear respuesta a JSON (si existe)
  const data = await res.json().catch(() => ({}));

  //  Validar que la respuesta sea exitosa
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
  }

  return data;
};

/**
 * Realiza una petición HTTP DELETE para eliminar un recurso.
 * 
 * - Incluye autenticación con Bearer Token.
 * - Si el token expiró, lo refresca y reintenta.
 * 
 * @async
 * @param {string} endpoint - Ruta de la API.
 * @returns {Promise<Response>} Respuesta completa de `fetch`.
 */
export const del = async (endpoint) => {
  let res = await fetch(API_URL + endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    }
  });

  //  Refrescar token si expiró
  if (res.status === 401) {
    await refreshAccessToken();
    res = await fetch(API_URL + endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
  }

  return res;
};

/**
 * Refresca el `accessToken` cuando expira usando el `refreshToken`.
 * 
 * - Envía el `refreshToken` al endpoint `usuarios/refresh`.
 * - Si es válido, actualiza el nuevo `accessToken` en `localStorage`.
 * - Si falla, limpia sesión y redirige a `login`.
 * 
 * @async
 * @returns {Promise<void>} No retorna valor, actualiza el token en `localStorage`.
 */
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;

  console.log("Token expirado, refrescando...");

  const res = await fetch(API_URL + "usuarios/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
  } else {
    //  Si no se pudo refrescar, cerrar sesión y mandar al login
    localStorage.clear();
    window.location.hash = "login";
  }
}

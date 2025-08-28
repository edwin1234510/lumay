import { routers } from "./routers.js";
import { alertaError } from "../componentes/sweetAlert.js";

/**
 * Función principal de enrutamiento de la aplicación.
 * 
 * Se encarga de interpretar el `hash` de la URL, determinar la ruta principal
 * y las posibles subrutas, validar permisos y renderizar la vista correspondiente.
 * 
 * - Si no hay `hash`, redirige al login.
 * - Configura el layout (con o sin grid).
 * - Valida roles, permisos y autenticación antes de cargar la vista.
 * 
 * @async
 * @param {HTMLElement} elemento - Contenedor donde se renderiza la vista solicitada.
 * @returns {Promise<void>} No retorna valor, solo realiza cambios en el DOM.
 */
export const router = async (elemento) => {
  // Obtiene el hash actual (sin el símbolo `#`) → Ej: "#cliente/reserva" → "cliente/reserva"
  const hash = location.hash.slice(1);
  // Divide el hash en partes, eliminando valores vacíos → Ej: "cliente/reserva/editar/123" → ["cliente","reserva","editar","123"]
  const partes = hash.split("/").filter(Boolean);

  // Si no existe hash (usuario recién entró) → redirigir al login
  if (partes.length === 0) {
    await validarYNavegar(routers.login, elemento);
    return;
  }

  // Busca la ruta principal en el objeto de routers según la primera parte del hash
  let ruta = routers[partes[0]];
  if (!ruta) {
    console.error("Ruta no encontrada:", partes[0]);
    return;
  }

  // Ajuste del layout según la ruta (con grid para privadas, sin grid para públicas)
  const grid = document.querySelector(".grid");
  const header = document.querySelector("#header");
  const sidebar = document.querySelector("#sidebar");

  if (ruta.private) {
    grid.classList.remove("grid-sin-layout");
    grid.classList.add("grid-con-layout");
  } else {
    grid.classList.remove("grid-con-layout");
    grid.classList.add("grid-sin-layout");
    if (header) header.innerHTML = "";   // Limpia header si no aplica
    if (sidebar) sidebar.innerHTML = ""; // Limpia sidebar si no aplica
  }

  // Si existen subrutas y el hash contiene más de un segmento
  if (ruta.routes && partes.length > 1) {
    const subPath = partes.slice(1).join("/"); // Une las partes después de la principal

    // 1️⃣ Validar primero que la ruta padre sea accesible
    const padreOk = await validarYNavegar(ruta, elemento);
    if (!padreOk) return;

    // 2️⃣ Intentar encontrar coincidencia exacta con la subruta
    let rutaSub = ruta.routes[subPath];
    if (!rutaSub) {
      // Si no hay coincidencia exacta → buscar rutas dinámicas (con parámetros)
      for (const key in ruta.routes) {
        const routeParts = key.split("/");
        const subParts = subPath.split("/");

        // Si tienen la misma cantidad de segmentos → posible coincidencia
        if (routeParts.length === subParts.length) {
          let params = []; // Guardará los valores dinámicos (ej: ID)
          let match = true;

          // Comparar segmento a segmento
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(":")) {
              // Si el segmento comienza con ":" → es parámetro dinámico
              params.push(subParts[i]);
            } else if (routeParts[i] !== subParts[i]) {
              // Si no coincide y no es dinámico → no es la ruta correcta
              match = false;
              break;
            }
          }
          // Si la ruta coincide, se guarda incluyendo los parámetros capturados
          if (match) rutaSub = { ...ruta.routes[key], params };
        }
      }
    }

    // 3️⃣ Validar permisos de la subruta encontrada antes de cargarla
    if (rutaSub) {
      const ok = await validarYNavegar(rutaSub, elemento, rutaSub.params || []);
      if (!ok) return;
    }
    return;
  }

  // Si no hay subrutas → validar y navegar directamente a la ruta principal
  const ok = await validarYNavegar(ruta, elemento);
  if (!ok) return;
};

// Guarda cuál fue la última vista cargada para evitar recargas innecesarias
let vistaActual = "";

/**
 * Carga la vista asociada a una ruta y ejecuta su controlador.
 * 
 * - Si la ruta contiene un `path`, obtiene el archivo HTML correspondiente.
 * - Evita recargar la vista si ya está activa.
 * - Si existe un `controller`, lo ejecuta pasando el contenedor y parámetros.
 * 
 * @async
 * @param {Object} ruta - Objeto con la definición de la ruta.
 * @param {HTMLElement} elemento - Contenedor donde se inyectará la vista.
 * @param {Array<string>} [params=[]] - Parámetros dinámicos de la ruta (ej: ID de un recurso).
 * @returns {Promise<void>} No retorna valor, modifica el DOM y ejecuta lógica de controlador.
 */
const navegar = async (ruta, elemento, params = []) => {
  if (!ruta) return;

  // Si la ruta tiene un archivo asociado en `path`
  if (ruta.path) {
    // Si ya está cargada la misma vista → evitar recargar
    if (vistaActual === ruta.path) return;

    // Solicita el archivo HTML de la vista
    const seccion = await fetch(`./src/views/${ruta.path}`);
    if (!seccion.ok) throw new Error("No se pudo leer el archivo");

    // Inserta el contenido HTML en el contenedor principal
    const html = await seccion.text();
    elemento.innerHTML = html;

    // Actualiza referencia de la vista actual
    vistaActual = ruta.path;
  }

  // Si la ruta define un controlador JS → ejecutarlo
  if (typeof ruta.controller === "function") {
    ruta.controller(elemento, params);
  }
};

/**
 * Valida el acceso del usuario a una ruta antes de renderizarla.
 * 
 * - Si la ruta es pública, se navega directamente.
 * - Si es privada, valida autenticación mediante token en `localStorage`.
 * - Verifica el rol del usuario (`admin` o `cliente`) según el hash de la URL.
 * - Comprueba permisos adicionales definidos en la ruta (`can`).
 * - En caso de fallo, muestra alerta de error y redirige al login si es necesario.
 * 
 * @async
 * @param {Object} ruta - Objeto de configuración de la ruta (path, private, can, controller, etc.).
 * @param {HTMLElement} elemento - Contenedor donde se inyectará la vista si es válida.
 * @param {Array<string>} [params=[]] - Parámetros dinámicos de la ruta.
 * @returns {Promise<boolean>} Retorna `true` si la navegación es válida, `false` en caso contrario.
 */
const validarYNavegar = async (ruta, elemento, params = []) => {
  // Si la ruta es pública → cargar directamente
  if (!ruta.private) {
    await navegar(ruta, elemento, params);
    return true;
  }

  // Si es privada → verificar si existe token de sesión
  const token = localStorage.getItem("accessToken");
  if (!token) {
    // Si no hay token → redirigir a login
    window.location.hash = "login";
    return false;
  }

  // Verifica el rol almacenado en localStorage
  const rol = localStorage.getItem("rol");

  // Si intenta entrar a #admin pero no es admin → denegar
  if (location.hash.startsWith("#admin") && rol !== "admin") {
    alertaError("No tienes permisos para acceder a esta sección");
    return false;
  }
  // Si intenta entrar a #cliente pero no es cliente → denegar
  if (location.hash.startsWith("#cliente") && rol !== "cliente") {
    alertaError("No tienes permisos para acceder a esta sección");
    return false;
  }

  // Verificar permisos extra definidos en la ruta (`can`)
  const permisos = getPermisos();
  if (ruta.can && !permisos.includes(ruta.can)) {
    alertaError("No tienes permisos para acceder a esta sección");
    return false;
  }

  // Si pasa todas las validaciones → cargar la vista
  await navegar(ruta, elemento, params);
  return true;
};

/**
 * Obtiene la lista de permisos del usuario desde el token JWT almacenado en `localStorage`.
 * 
 * - Extrae el payload del token en Base64.
 * - Lo decodifica a objeto JSON.
 * - Retorna el array de permisos o un array vacío si no existe.
 * 
 * @returns {string[]} Array de permisos asociados al usuario autenticado.
 */
export const getPermisos = () => {
  // Recupera el token de localStorage
  const token = localStorage.getItem("accessToken");
  if (!token) return [];

  // Extrae el payload (parte intermedia del JWT)
  const payload = token.split(".")[1];
  if (!payload) return [];

  try {
    // Decodifica el payload en Base64 y lo convierte a objeto
    const decoded = JSON.parse(atob(payload));

    // Retorna los permisos si existen, de lo contrario un array vacío
    return decoded.permisos || [];
  } catch (e) {
    console.error("Error al decodificar JWT:", e);
    return [];
  }
};

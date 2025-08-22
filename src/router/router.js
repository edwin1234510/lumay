import { routers } from "./routers.js";

export const router = async (elemento) => {
  const hash = location.hash.slice(1); // ejemplo: "cliente/reserva/editar/123"
  const partes = hash.split("/").filter(Boolean);

  // Si no hay hash → login
  if (partes.length === 0) {
    return navegar(routers.login, elemento);
  }

  let ruta = routers[partes[0]];
  if (!ruta) {
    console.error("Ruta no encontrada:", partes[0]);
    return;
  }

  // Verificar grid (layout con o sin header/sidebar)
  const grid = document.querySelector(".grid");
  const header = document.querySelector("#header");
  const sidebar = document.querySelector("#sidebar");

  if (ruta.private) {
    grid.classList.remove("grid-sin-layout");
    grid.classList.add("grid-con-layout");
  } else {
    grid.classList.remove("grid-con-layout");
    grid.classList.add("grid-sin-layout");
    if (header) header.innerHTML = "";
    if (sidebar) sidebar.innerHTML = "";
  }

  // Si la ruta tiene subrutas (ejemplo cliente/* o admin/*)
  if (ruta.routes) {
    if (partes.length > 1) {
      const subPath = partes.slice(1).join("/"); // ejemplo: "reserva/editar/123"

      // ⚡ Primero asegúrate de que el dashboard se cargue
      await navegar(ruta, elemento);

      // Coincidencia exacta
      if (ruta.routes[subPath]) {
        return navegar(ruta.routes[subPath], elemento);
      }

      // Coincidencia con parámetros dinámicos
      for (const key in ruta.routes) {
        const routeParts = key.split("/");
        const subParts = subPath.split("/");

        if (routeParts.length === subParts.length) {
          let params = [];
          let match = true;

          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(":")) {
              params.push(subParts[i]);
            } else if (routeParts[i] !== subParts[i]) {
              match = false;
              break;
            }
          }

          if (match) {
            return navegar(ruta.routes[key], elemento, params);
          }
        }
      }
    } else {
      // ⚡ Ruta por defecto si no hay subruta
      await navegar(ruta, elemento);

      if (partes[0] === "cliente") {
        return navegar(ruta.routes.agendar, elemento);
      }
      if (partes[0] === "admin") {
        return navegar(ruta.routes.usuarios, elemento);
      }
    }
  }

  // Ruta principal sin subrutas
  return navegar(ruta, elemento);
};

let vistaActual = "";

const navegar = async (ruta, elemento, params = []) => {
  if (!ruta) return;

  if (ruta.path) {
    if (vistaActual === ruta.path) return; // no recargar si es la misma
    const seccion = await fetch(`./src/views/${ruta.path}`);
    if (!seccion.ok) throw new Error("No se pudo leer el archivo");
    const html = await seccion.text();
    elemento.innerHTML = html;
    vistaActual = ruta.path;
  }

  if (typeof ruta.controller === "function") {
    ruta.controller(elemento, params);
  }
};

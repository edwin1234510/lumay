import { routers } from "./routers.js";

export const router = async (elemento) => {
  const hash = location.hash.slice(1); // Ej: "cliente/detalles"
  const ruta = recorrerRutas(routers, hash);

  if (!ruta) {
    console.error("Ruta no encontrada");
    return;
  }

  if (ruta.path) {
    await cargarVista(ruta.path, elemento);
  }

  if (typeof ruta.controller === "function") {
    ruta.controller(elemento);
  }
};

const recorrerRutas = (routers, hash) => {
  const partes = hash.split("/").filter(Boolean); // Ej: ["cliente", "detalles"]

  // Si no hay hash, ir a login
  if (partes.length === 0 || partes[0] === "login") {
    return routers.login;
  }

  // Si es ruta principal
  if (routers[partes[0]] && !routers[partes[0]]["/"]) {
    return routers[partes[0]];
  }

  // Si es anidada como cliente/detalles
  if (routers[partes[0]] && routers[partes[0]][partes[1]]) {
    return routers[partes[0]][partes[1]];
  }

  // Si es cliente solo: cliente/
  if (routers[partes[0]] && routers[partes[0]]["/"]) {
    return routers[partes[0]]["/"];
  }

  return null;
};

let vistaActual = "";

const cargarVista = async (path, elemento) => {
  if (vistaActual === path) return; // No recargar si ya es la misma
  const seccion = await fetch(`./src/views/${path}`);
  if (!seccion.ok) throw new Error("No se pudo leer el archivo");
  const html = await seccion.text();
  elemento.innerHTML = html;
  vistaActual = path;
};

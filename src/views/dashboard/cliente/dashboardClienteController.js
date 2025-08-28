import { headerController } from "../../../componentes/headerController"; 

/**
 * Controlador principal para cargar y gestionar la vista del Dashboard del cliente.
 * 
 * Este controlador se encarga de:
 *  1. Insertar dinámicamente el contenido del encabezado (`header.html`) en el DOM.
 *  2. Inicializar el comportamiento del encabezado mediante la función `headerController`.
 *  3. Insertar dinámicamente el contenido de la barra lateral del cliente (`sidebarCliente.html`) en el DOM.
 * 
 * @async
 * @function dashboardClienteController
 * @returns {Promise<void>} - No retorna ningún valor. 
 *                            La función realiza modificaciones en el DOM de manera asíncrona.
 */
export const dashboardClienteController = async () => {
  // Selecciona el contenedor del encabezado en el DOM
  const header = document.querySelector("#header");

  // Carga el contenido del archivo header.html de manera asíncrona
  const headerHtml = await fetch("./src/componentes/header.html")
    .then(r => r.text()); // Convierte la respuesta a texto (HTML)

  // Inserta el contenido cargado en el contenedor del encabezado
  header.innerHTML = headerHtml;

  // Inicializa la lógica del encabezado (manejo de usuario y sidebar)
  await headerController();

  // Selecciona el contenedor de la barra lateral en el DOM
  const sidebar = document.querySelector("#sidebar");

  // Carga el contenido del archivo sidebarCliente.html de manera asíncrona
  const sidebarHtml = await fetch("./src/componentes/sidebarCliente.html")
    .then(r => r.text()); // Convierte la respuesta a texto (HTML)

  // Inserta el contenido cargado en el contenedor de la barra lateral
  sidebar.innerHTML = sidebarHtml;
};

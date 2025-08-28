import { headerController } from "../../../componentes/headerController"; 

/**
 * Controlador principal del panel de administración (Dashboard Admin).
 * 
 * Esta función se encarga de:
 * - Cargar dinámicamente el componente del encabezado (`headerAdmin.html`) 
 *   dentro del contenedor correspondiente en el DOM.
 * - Inicializar la lógica del encabezado mediante la ejecución de `headerController()`.
 * - Cargar dinámicamente el componente de la barra lateral (`sidebarAdmin.html`)
 *   dentro del contenedor correspondiente en el DOM.
 * 
 * @async
 * @function dashboardAdminController
 * @returns {Promise<void>} No retorna ningún valor; solo manipula el DOM
 *                          para construir la interfaz del dashboard del administrador.
 */
export const dashboardAdminController = async () => {

    // Selecciona el contenedor del encabezado en el DOM
    const header = document.querySelector("#header");

    // Carga el HTML del encabezado específico para el administrador
    // usando `fetch` y lo convierte en texto
    const headerHtml = await fetch("./src/componentes/headerAdmin.html").then(r => r.text());

    // Inserta el contenido del encabezado en el DOM
    header.innerHTML = headerHtml;

    // Llama al controlador del encabezado para inicializar la lógica asociada,
    // como mostrar el nombre de usuario o controlar el menú lateral
    await headerController();

    // Selecciona el contenedor de la barra lateral en el DOM
    const sidebar = document.querySelector("#sidebar");

    // Carga el HTML de la barra lateral específica para el administrador
    const sidebarHtml = await fetch("./src/componentes/sidebarAdmin.html").then(r => r.text());

    // Inserta el contenido de la barra lateral en el DOM
    sidebar.innerHTML = sidebarHtml;
};

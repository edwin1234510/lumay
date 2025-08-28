// Importamos la función "router" desde el archivo de rutas
// Esta función se encargará de manejar la navegación entre las diferentes vistas/páginas.
import { router } from "./router/router";

// Importamos los estilos generales de la aplicación
import './estilos/style.css';

// Obtenemos la referencia al contenedor principal donde se cargará el contenido dinámico
// Este div o sección se identifica en el HTML con el id "contenido-dinamico".
const app = document.querySelector("#contenido-dinamico");

// Evento que se ejecuta cuando el documento HTML ha sido completamente cargado y parseado.
// Aquí invocamos la función "router" pasando el contenedor principal, para renderizar la vista inicial.
window.addEventListener("DOMContentLoaded", () => {
    router(app);
});

// Evento que se ejecuta cuando cambia el hash (#) en la URL del navegador.
// Sirve para manejar la navegación en aplicaciones SPA (Single Page Application),
// permitiendo que al cambiar de sección, se renderice el contenido correspondiente sin recargar la página.
window.addEventListener("hashchange", () => {
    router(app);
});

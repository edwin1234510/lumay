import { alertaError, alertaExito } from "../../componentes/sweetAlert.js";
import { post } from "../../utils/api.js";
import { nombreRol } from "../../validaciones/validacion.js";

/**
 * Controlador de inicio de sesión.
 *
 * - Se encarga de manejar el formulario de login.
 * - Valida que los campos no estén vacíos.
 * - Envía las credenciales al backend para autenticar al usuario.
 * - Guarda los datos de sesión (usuario, tokens y rol) en `localStorage`.
 * - Redirige al usuario según su rol.
 * - Muestra mensajes de éxito o error según el caso.
 *
 * @function loginController
 * @returns {void} No retorna ningún valor. La función se encarga de manejar efectos secundarios:
 *                 eventos, redirecciones, almacenamiento local y alertas visuales.
 */
export const loginController = () => {
  // Obtenemos el formulario de login del DOM
  const formularioLogin = document.querySelector("#login");

  // Seleccionamos el contenedor principal dinámico
  const main = document.querySelector("#contenido-dinamico");

  // Se agrega una clase para quitar padding (solo en esta vista de login)
  main.classList.add("main-container--sin-padding");

  // Validamos que exista el formulario en la vista actual
  if (!formularioLogin) {
    console.error("Formulario de login no encontrado");
    return; // Se detiene la ejecución si no existe el formulario
  }

  // Escuchamos el evento de envío del formulario
  formularioLogin.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto (recargar la página)

    // Obtenemos valores del formulario y eliminamos espacios en blanco
    const correo = document.querySelector("#email").value.trim();
    const contrasena = document.querySelector("#contrasena").value.trim();

    // Validación: Ningún campo debe estar vacío
    if (!correo || !contrasena) {
      return alertaError("Ningún campo puede estar vacío");
    }

    // Creamos objeto con credenciales
    const objeto = { correo, contrasena };

    try {
      // Realizamos una petición POST al backend para autenticar
      const response = await post("usuarios/login", objeto);

      //  Si la respuesta es exitosa
      if (response.ok) {
        const data = await response.json(); // Parseamos la respuesta JSON

        // Validamos que la respuesta contenga la información mínima necesaria
        if (!data.usuario || !data.accessToken || !data.refreshToken) {
          return alertaError("Respuesta del servidor incompleta, contacte soporte.");
        }

        // Guardamos información de sesión en localStorage
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Obtenemos el nombre del rol a partir del id de rol del usuario
        const rol = await nombreRol(data.usuario.id_rol);
        localStorage.setItem("rol", rol); // Guardamos el rol en localStorage

        // Mostramos mensaje de bienvenida
        alertaExito(`Bienvenido, ${data.usuario.nombre}`);

        // Redirigimos al usuario según su rol
        if (rol === "admin") {
          // Si es admin, se le redirige a la vista de gestión de usuarios
          window.location.hash = "admin/usuarios";
          main.classList.remove("main-container--sin-padding");
        } else if (rol === "cliente") {
          // Si es cliente, se le redirige a la vista de agendar cita
          window.location.hash = "cliente/agendar";
          main.classList.remove("main-container--sin-padding");
        } else {
          // Si el rol no está contemplado, mostramos error
          alertaError("Rol desconocido, contacte soporte.");
        }

      //  Manejo de errores específicos según código de estado HTTP
      } else if (response.status === 403) {
        alertaError("El usuario está inactivo, no puede iniciar sesión.");
      } else if (response.status === 401) {
        alertaError("Credenciales incorrectas.");
      } else {
        alertaError("Error desconocido al iniciar sesión.");
      }

    } catch (error) {
      // Manejo de errores de conexión o excepciones
      alertaError("Error de conexión con el servidor");
      console.error(error);
    }
  });
};

import { alertaError, alertaExito } from "../../componentes/sweetAlert";
import { get, post } from "../../utils/api";
import { esContrasenaSegura, esCorreoValido, esTelefonoValido, soloLetras, soloNumeros } from "../../validaciones/validacion";

/**
 * Controlador de registro de usuarios.
 *
 * - Gestiona el formulario de registro y sus validaciones.
 * - Restringe el ingreso de caracteres inválidos (solo letras o números).
 * - Verifica que los campos obligatorios estén completos y sean válidos.
 * - Comprueba si ya existen usuarios con documento, correo o teléfono repetidos.
 * - Envía la información del nuevo usuario al backend y lo registra.
 * - Redirige al login después de un registro exitoso.
 *
 * @async
 * @function registroController
 * @returns {Promise<void>} No retorna valor; se encarga de manejar efectos colaterales:
 *                          validaciones, alertas, redirección y registro en backend.
 */
export const registroController = async () => {
  // Seleccionamos el contenedor principal dinámico y ajustamos estilos para la vista de registro
  const main = document.querySelector("#contenido-dinamico");
  main.classList.add("main-container--sin-padding");

  // Obtenemos el formulario de registro
  const formularioRegistro = document.querySelector("#formRegistro");

  // Inputs del formulario
  const documento = document.querySelector("#documento");
  const nombre = document.querySelector("#nombre");
  const apellido = document.querySelector("#apellido");
  const correo = document.querySelector("#correo");
  const contrasena = document.querySelector("#contrasena");
  const telefono = document.querySelector("#telefono");

  // Restricciones de caracteres en tiempo de escritura
  documento.addEventListener("keydown", soloNumeros); // solo números en documento
  nombre.addEventListener("keydown", soloLetras); // solo letras en nombre
  apellido.addEventListener("keydown", soloLetras); // solo letras en apellido
  telefono.addEventListener("keydown", soloNumeros); // solo números en teléfono

  // Evento de envío del formulario de registro
  formularioRegistro.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevenimos que el formulario recargue la página

    // Validación: todos los campos son obligatorios
    if (
      documento.value.trim() === "" ||
      nombre.value.trim() === "" ||
      apellido.value.trim() === "" ||
      correo.value.trim() === "" ||
      contrasena.value.trim() === "" ||
      telefono.value.trim() === ""
    ) {
      return alertaError("Ningún campo puede estar vacío");
    }

    // Validación: el documento debe tener entre 6 y 10 caracteres
    if (documento.value.trim().length < 6 || documento.value.trim().length > 10) {
      return alertaError("El documento debe tener entre 6 y 10 caracteres");
    }

    // Validaciones adicionales: correo válido, contraseña segura y teléfono válido
    if (
      !esCorreoValido(correo.value) ||
      !esContrasenaSegura(contrasena.value) ||
      !esTelefonoValido(telefono.value)
    ) {
      return; // Si alguna validación falla, no continúa
    }

    //  Verificación de duplicados en la base de datos
    const repetidos = await get("usuarios"); // Traemos todos los usuarios ya registrados

    // Documento repetido
    const existeDocumento = repetidos.some(
      (u) => u.numero_documento == documento.value.trim()
    );
    if (existeDocumento) {
      return alertaError("Ya existe un usuario con ese número de documento");
    }

    // Correo repetido
    const existeCorreo = repetidos.some(
      (u) => u.correo.toLowerCase() === correo.value.trim().toLowerCase()
    );
    if (existeCorreo) {
      return alertaError("Ya existe un usuario con ese correo");
    }

    // Teléfono repetido
    const existeTelefono = repetidos.some(
      (u) => u.telefono == telefono.value.trim()
    );
    if (existeTelefono) {
      return alertaError("Ya existe un usuario con ese número de teléfono");
    }

    //  Construcción del objeto usuario a registrar
    const objeto = {
      numero_documento: parseInt(documento.value.trim()),
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      correo: correo.value.trim(),
      contrasena: contrasena.value.trim(),
      telefono: parseInt(telefono.value.trim()),
      id_rol: 1, // Rol por defecto: cliente
      id_estado_usuario: 1, // Estado activo por defecto
    };

    //  Intento de registro en el backend
    try {
      const response = await post("usuarios", objeto); // Envío de datos a la API
      alertaExito("¡Te has registrado correctamente!");
      window.location.hash = "#login"; // Redirigimos a la vista de login
    } catch (error) {
      // Manejo de error en la petición
      alertaError("No fue posible el registro");
      console.error(error);
    }
  });
};

import { headerController } from "../../../../componentes/headerController.js";
import { alertaExito, alertaError } from "../../../../componentes/sweetAlert.js";
import { get, put } from "../../../../utils/api.js";
import { esContrasenaSegura, esCorreoValido, esTelefonoValido, soloLetras, soloNumeros } from "../../../../validaciones/validacion.js";

/**
 * Controlador del perfil de usuario.
 *
 * @async
 * @function perfilController
 * @returns {Promise<void>} - No retorna un valor directo.
 * 
 * Funcionalidades principales:
 * 1. Verifica si hay un usuario en `localStorage`, si no, redirige al login.
 * 2. Carga los datos del usuario desde la API y llena el formulario.
 * 3. Valida los campos antes de actualizar (correo, teléfono, contraseña segura).
 * 4. Envía la actualización al backend mediante `PUT`.
 * 5. Guarda los cambios en `localStorage` y actualiza el header.
 * 6. Permite cerrar sesión limpiando el `localStorage`.
 */
export const perfilController = async () => {
  //  Recuperar usuario logueado desde localStorage
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));

  // Validación: si no hay usuario guardado, redirigir al login
  if (!usuarioLocal) {
    window.location.hash = "#login";
    return;
  }

  //  Referencias a los elementos del formulario
  const form = document.querySelector("#formPerfil");
  const inputDocumento = document.querySelector("#documento");
  const inputNombre = document.querySelector("#nombre");
  const inputApellido = document.querySelector("#apellido");
  const inputCorreo = document.querySelector("#correo");
  const inputTelefono = document.querySelector("#telefono");
  const inputContrasena = document.querySelector("#contrasena");
  const btnCerrarSesion = document.querySelector("#cerrarSesion");

  //  Validaciones inmediatas en los inputs (solo números o letras)
  inputDocumento.addEventListener("keydown", soloNumeros);
  inputNombre.addEventListener("keydown", soloLetras);
  inputApellido.addEventListener("keydown", soloLetras);
  inputTelefono.addEventListener("keydown", soloNumeros);

  try {
    //  Obtener usuarios desde la API
    const usuarios = await get("usuarios");

    // Buscar el usuario logueado en la lista
    const usuario = usuarios.find(u => u.id_usuario === usuarioLocal.id_usuario);

    // Si no se encuentra el usuario → cerrar sesión y redirigir
    if (!usuario) {
      alertaError("No se encontró el usuario");
      localStorage.removeItem("usuario");
      window.location.hash = "#login";
      return;
    }

    //  Llenar el formulario con la información del usuario
    inputDocumento.value = usuario.numero_documento || "";
    inputNombre.value = usuario.nombre || "";
    inputApellido.value = usuario.apellido || "";
    inputCorreo.value = usuario.correo || "";
    inputTelefono.value = usuario.telefono || "";
    inputContrasena.value = ""; // nunca mostramos la contraseña real por seguridad

    /**
     * Evento para manejar la actualización del perfil.
     * Valida los campos, construye el objeto actualizado y lo envía al backend.
     */
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      //  Validar que todos los campos requeridos estén completos
      if (
        !inputNombre.value.trim() ||
        !inputApellido.value.trim() ||
        !inputCorreo.value.trim() ||
        !inputTelefono.value.trim()
      ) {
        alertaError("Todos los campos son obligatorios");
        return;
      }

      // Validar correo y teléfono
      if (!esCorreoValido(inputCorreo.value) || !esTelefonoValido(inputTelefono.value)) {
        return;
      }

      // 🔹 Validar la contraseña solo si el usuario ingresó una nueva
      let nuevaContrasena = inputContrasena.value.trim();
      if (nuevaContrasena && !esContrasenaSegura(nuevaContrasena)) {
        return;
      }

      //  Construcción del objeto con los datos actualizados
      const datosActualizados = {
        id_usuario: usuario.id_usuario,
        numero_documento: inputDocumento.value.trim(),
        nombre: inputNombre.value.trim(),
        apellido: inputApellido.value.trim(),
        correo: inputCorreo.value.trim(),
        telefono: inputTelefono.value.trim(),
        contrasena: nuevaContrasena || null, // si no cambia, enviar null
        id_rol: usuario.id_rol,
        id_estado_usuario: usuario.id_estado_usuario,
      };

      try {
        //  Enviar datos al backend
        const res = await put(`usuarios/${usuario.id_usuario}`, datosActualizados);

        // Mostrar éxito y actualizar información en localStorage
        alertaExito("Perfil actualizado correctamente");

        // Guardar usuario actualizado en localStorage (manteniendo la contraseña si no se cambió)
        const usuarioFinal = {
          ...datosActualizados,
          contrasena: nuevaContrasena || usuario.contrasena
        };

        localStorage.setItem("usuario", JSON.stringify(usuarioFinal));

        //  Actualizar header después de cambios
        headerController();

      } catch (error) {
        alertaError("Error de conexión con el servidor");
        console.error(error);
      }
    });

  } catch (error) {
    // Manejo de errores al cargar el usuario
    alertaError("Error al cargar los datos del usuario");
    console.error(error);
  }

  /**
   * Evento para cerrar sesión.
   * Limpia el localStorage y redirige al login.
   */
  btnCerrarSesion.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuario");
    window.location.hash = "#login";
  });
};

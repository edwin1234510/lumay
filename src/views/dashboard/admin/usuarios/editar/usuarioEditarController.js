import { get, put } from "../../../../../utils/api.js"; 
import { alertaExito, alertaError } from "../../../../../componentes/sweetAlert.js";
import { esContrasenaSegura, esCorreoValido, esTelefonoValido, soloLetras, soloNumeros } from "../../../../../validaciones/validacion.js";

/**
 * Controlador para la edición de un usuario en el panel de administración.
 *
 * - Carga los datos de un usuario específico a partir de su ID.
 * - Rellena un formulario con los datos del usuario a editar.
 * - Aplica validaciones en los campos (correo, teléfono, contraseña, etc.).
 * - Permite actualizar los datos del usuario en la API.
 * - Controla la navegación al regresar a la lista de usuarios.
 *
 * @async
 * @param {number|string} id_usuario - ID del usuario que se desea editar.
 * @returns {Promise<void>} No retorna directamente. Sus efectos son:
 *   - Rellenar el formulario de edición con los datos del usuario.
 *   - Enviar los cambios a la API si la validación es correcta.
 *   - Mostrar alertas de éxito o error según corresponda.
 */
export const usuarioEditarController = async (id_usuario) => {
  //  Selección de elementos del DOM
  const form = document.querySelector("#formEditar");
  const btnRegresar = document.querySelector("#Regresar");

  const inputDocumento = document.querySelector("#documento");
  const inputNombre = document.querySelector("#nombre");
  const inputApellido = document.querySelector("#apellido");
  const inputCorreo = document.querySelector("#correo");
  const inputContrasena = document.querySelector("#contrasena");
  const inputTelefono = document.querySelector("#telefono");
  const selectEstado = document.querySelector("#estado");

  //  Obtener todos los usuarios y buscar el que se va a editar
  const usuarios = await get("usuarios");
  const usuario = usuarios.find(u => parseInt(u.id_usuario) === parseInt(id_usuario));

  // Si el usuario no existe, mostrar alerta y salir
  if (!usuario) {
    alertaError("No se encontró el usuario");
    return;
  }

  //  Cargar estados manualmente (activo / inactivo)
  const estados = [
    { id_estado_usuario: 1, nombre_estado: "Activo" },
    { id_estado_usuario: 2, nombre_estado: "Inactivo" }
  ];

  // Crear <option> para cada estado y agregarlos al <select>
  estados.forEach(estado => {
    const option = document.createElement("option");
    option.value = estado.id_estado_usuario;
    option.textContent = estado.nombre_estado;
    selectEstado.appendChild(option);
  });

  // Seleccionar el estado actual del usuario
  selectEstado.value = usuario.id_estado_usuario || 1;

  //  Llenar los inputs del formulario con la información del usuario
  inputDocumento.value = usuario.numero_documento;
  inputNombre.value = usuario.nombre;
  inputApellido.value = usuario.apellido;
  inputCorreo.value = usuario.correo;
  inputContrasena.value = ""; // Contraseña no se muestra por seguridad
  inputTelefono.value = usuario.telefono;

  //  Validaciones de teclado para restringir caracteres
  inputDocumento.addEventListener("keydown", soloNumeros);
  inputNombre.addEventListener("keydown", soloLetras);
  inputApellido.addEventListener("keydown", soloLetras);
  inputTelefono.addEventListener("keydown", soloNumeros);

  /**
   *  Evento submit del formulario de edición.
   * - Valida los campos requeridos.
   * - Valida formato de correo, teléfono y seguridad de la contraseña.
   * - Envía los datos actualizados al servidor.
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    //  Validación: todos los campos obligatorios (excepto contraseña) deben estar llenos
    if (!inputDocumento.value.trim() || !inputNombre.value.trim() || !inputApellido.value.trim() ||
        !inputCorreo.value.trim() || !inputTelefono.value.trim()) {
      alertaError("Todos los campos son obligatorios");
      return;
    }

    //  Validación: correo válido
    if (!esCorreoValido(inputCorreo.value)) {
      alertaError("Correo inválido");
      return;
    }

    // Validación: teléfono válido
    if (!esTelefonoValido(inputTelefono.value)) {
      alertaError("Teléfono inválido");
      return;
    }

    //  Validación: contraseña segura (solo si se escribió una nueva)
    let nuevaContrasena = inputContrasena.value.trim();
    if (nuevaContrasena && !esContrasenaSegura(nuevaContrasena)) {
      alertaError("Contraseña insegura");
      return;
    }

    //  Objeto de actualización (si no hay nueva contraseña, se envía null para no modificarla)
    const actualizacion = {
      numero_documento: inputDocumento.value.trim(),
      nombre: inputNombre.value.trim(),
      apellido: inputApellido.value.trim(),
      correo: inputCorreo.value.trim(),
      contrasena: nuevaContrasena || null, // null = no actualizar contraseña
      telefono: inputTelefono.value.trim(),
      id_rol: 1, // Rol fijo en este contexto (puede ajustarse en el futuro)
      id_estado_usuario: parseInt(selectEstado.value)
    };

    //  Enviar actualización a la API
    try {
      await put(`usuarios/${id_usuario}/estado`, actualizacion);
      alertaExito("Usuario actualizado correctamente");

      // Redirigir de vuelta a la lista de usuarios
      window.location.hash = "#admin/usuarios";
    } catch (error) {
      alertaError("Error al actualizar el usuario");
      console.error(error);
    }
  });

  /**
   *  Botón regresar: vuelve a la vista principal de usuarios.
   */
  btnRegresar.addEventListener("click", () => {
    window.location.hash = "#admin/usuarios";
  });
};

import { alertaExito, alertaError } from "../../../../componentes/sweetAlert.js";
import { get, put } from "../../../../utils/api.js";
import { esContrasenaSegura, esCorreoValido, esTelefonoValido, soloLetras, soloNumeros } from "../../../../validaciones/validacion.js";

export const perfilController = async () => {
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
  if (!usuarioLocal) {
    window.location.hash = "#login";
    return;
  }

  const form = document.querySelector("#formPerfil");
  const inputDocumento = document.querySelector("#documento");
  const inputNombre = document.querySelector("#nombre");
  const inputApellido = document.querySelector("#apellido");
  const inputCorreo = document.querySelector("#correo");
  const inputTelefono = document.querySelector("#telefono");
  const inputContrasena = document.querySelector("#contrasena");
  const btnCerrarSesion = document.querySelector("#cerrarSesion");

  inputDocumento.addEventListener("keydown", soloNumeros);
  inputNombre.addEventListener("keydown", soloLetras);
  inputApellido.addEventListener("keydown", soloLetras);
  inputTelefono.addEventListener("keydown", soloNumeros);

  try {
    // Obtener todos los usuarios
    const usuarios = await get("usuarios");

    // Buscar usuario que coincida con el id del localStorage
    const usuario = usuarios.find(u => u.id_usuario === usuarioLocal.id_usuario);

    if (!usuario) {
      alertaError("No se encontró el usuario");
      localStorage.removeItem("usuario");
      window.location.hash = "#login";
      return;
    }

    // Llenar formulario con datos frescos desde backend
    inputDocumento.value = usuario.numero_documento || "";
    inputNombre.value = usuario.nombre || "";
    inputApellido.value = usuario.apellido || "";
    inputCorreo.value = usuario.correo || "";
    inputTelefono.value = usuario.telefono || "";
    inputContrasena.value = usuario.contrasena || "";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (
        !inputNombre.value.trim() ||
        !inputApellido.value.trim() ||
        !inputCorreo.value.trim() ||
        !inputTelefono.value.trim() ||
        !inputContrasena.value.trim()
      ) {
        alertaError("Todos los campos son obligatorios");
        return;
      }
      if (
        !esCorreoValido(inputCorreo.value) ||
        !esContrasenaSegura(inputContrasena.value) ||
        !esTelefonoValido(inputTelefono.value)
      ) {
        return;
      }

      const datosActualizados = {
        id_usuario: usuario.id_usuario,
        numero_documento: inputDocumento.value.trim(),
        nombre: inputNombre.value.trim(),
        apellido: inputApellido.value.trim(),
        correo: inputCorreo.value.trim(),
        telefono: inputTelefono.value.trim(),
        contrasena: inputContrasena.value.trim(),
        id_rol: usuario.id_rol,
        id_estado_usuario: usuario.id_estado_usuario,
      };
      console.log(datosActualizados);
      
      try {
        const res = await put(`usuarios/${usuario.id_usuario}/estado`, datosActualizados);
        if (res.ok) {
          alertaExito("Perfil actualizado correctamente");
          localStorage.setItem("usuario", JSON.stringify(datosActualizados));
        } else {
          alertaError("Error al actualizar el perfil");
        }
      } catch (error) {
        alertaError("Error de conexión con el servidor");
        console.error(error);
      }
    });

  } catch (error) {
    alertaError("Error al cargar los datos del usuario");
    console.error(error);
  }

  btnCerrarSesion.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuario");
    window.location.hash = "#login";
  });
};


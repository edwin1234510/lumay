import { get, put } from "../../../../../utils/api.js";
import { alertaExito, alertaError } from "../../../../../componentes/sweetAlert.js";
import { esContrasenaSegura, esCorreoValido, esTelefonoValido, soloLetras, soloNumeros } from "../../../../../validaciones/validacion.js";
import { nombreRol } from "../../../../../validaciones/validacion.js";

export const usuarioEditarController = async (id_usuario) => {
  const form = document.querySelector("#formEditar");
  const btnRegresar = document.querySelector("#Regresar");

  const inputDocumento = document.querySelector("#documento");
  const inputNombre = document.querySelector("#nombre");
  const inputApellido = document.querySelector("#apellido");
  const inputCorreo = document.querySelector("#correo");
  const inputContrasena = document.querySelector("#contrasena");
  const inputTelefono = document.querySelector("#telefono");
  const inputRol = document.querySelector("#rol");

  // Obtener todos los usuarios y buscar el que se va a editar
  const usuarios = await get("usuarios");
  const usuario = usuarios.find(u => parseInt(u.id_usuario) === parseInt(id_usuario));

  if (!usuario) {
    alertaError("No se encontró el usuario");
    return;
  }

  // Obtener el nombre del rol con tu función personalizada
  const nombreDelRol = await nombreRol(usuario.id_rol);
  inputRol.value = nombreDelRol;
  inputRol.readOnly = true;

  // Llenar los inputs
  inputDocumento.value = usuario.numero_documento;
  inputNombre.value = usuario.nombre;
  inputApellido.value = usuario.apellido;
  inputCorreo.value = usuario.correo;
  inputContrasena.value = usuario.contrasena;
  inputTelefono.value = usuario.telefono;

  inputDocumento.addEventListener("keydown", soloNumeros);
  inputNombre.addEventListener("keydown", soloLetras);
  inputApellido.addEventListener("keydown", soloLetras);
  inputTelefono.addEventListener("keydown", soloNumeros);

  // Actualizar usuario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (
      !inputDocumento.value.trim() ||
      !inputNombre.value.trim() ||
      !inputApellido.value.trim() ||
      !inputCorreo.value.trim() ||
      !inputContrasena.value.trim() ||
      !inputTelefono.value.trim()
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

    const actualizacion = {
      numero_documento: inputDocumento.value.trim(),
      nombre: inputNombre.value.trim(),
      apellido: inputApellido.value.trim(),
      correo: inputCorreo.value.trim(),
      contrasena: inputContrasena.value.trim(),
      telefono: inputTelefono.value.trim(),
      // El rol no se modifica, pero se debe enviar porque el PUT lo necesita
      id_rol: usuario.id_rol
    };

    const res = await put(`usuarios/${id_usuario}`, actualizacion);
    if (res.ok) {
      alertaExito("Usuario actualizado correctamente");
      window.location.hash = "#admin/clientes";
    } else {
      alertaError("Error al actualizar el usuario");
    }
  });

  btnRegresar.addEventListener("click", () => {
    window.location.hash = "#admin/usuarios";
  });
};

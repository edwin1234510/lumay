import { get, put } from "../../../../../utils/api.js";
import { alertaExito, alertaError } from "../../../../../componentes/sweetAlert.js";
import { esContrasenaSegura, esCorreoValido, esTelefonoValido, soloLetras, soloNumeros } from "../../../../../validaciones/validacion.js";

export const usuarioEditarController = async (id_usuario) => {
  const form = document.querySelector("#formEditar");
  const btnRegresar = document.querySelector("#Regresar");

  const inputDocumento = document.querySelector("#documento");
  const inputNombre = document.querySelector("#nombre");
  const inputApellido = document.querySelector("#apellido");
  const inputCorreo = document.querySelector("#correo");
  const inputContrasena = document.querySelector("#contrasena");
  const inputTelefono = document.querySelector("#telefono");
  const selectEstado = document.querySelector("#estado");

  // Obtener todos los usuarios y buscar el que se va a editar
  const usuarios = await get("usuarios");
  const usuario = usuarios.find(u => parseInt(u.id_usuario) === parseInt(id_usuario));

  if (!usuario) {
    alertaError("No se encontró el usuario");
    return;
  }

  // **Carga de estados** (puedes cambiar la URL si tienes un endpoint específico)
  // Si tienes pocos estados, puedes hardcodear así:
  const estados = [
    { id_estado_usuario: 1, nombre_estado: "Activo" },
    { id_estado_usuario: 2, nombre_estado: "Inactivo" }
  ];

  // Llenar el select con los estados disponibles
  estados.forEach(estado => {
    const option = document.createElement("option");
    option.value = estado.id_estado_usuario;
    option.textContent = estado.nombre_estado;
    selectEstado.appendChild(option);
  });

  // Setear el estado actual del usuario en el select
  selectEstado.value = usuario.id_estado_usuario || 1; // Asume activo si no tiene

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
      id_rol: 1,
      id_estado_usuario: parseInt(selectEstado.value)
    };

    const res = await put(`usuarios/${id_usuario}/estado`, actualizacion);
    if (res.ok) {
      alertaExito("Usuario actualizado correctamente");
      window.location.hash = "#admin/usuarios";
    } else {
      alertaError("Error al actualizar el usuario");
    }
  });

  btnRegresar.addEventListener("click", () => {
    window.location.hash = "#admin/usuarios";
  });
};

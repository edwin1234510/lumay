import { nombreRol } from "../../../../validaciones/validacion.js";
import { confirmarAccion, alertaExito, alertaError } from "../../../../componentes/sweetAlert.js";
import { del, get } from "../../../../utils/api.js";

export const usuarioController = async () => {
  const adminActual = JSON.parse(localStorage.getItem("usuario")); // 👈 Admin logueado
  const usuarios = await get(`usuarios`);

  const tbody = document.querySelector(".tabla__cuerpo");
  tbody.innerHTML = ""; // Limpiar por si se vuelve a llamar

  for (const usuario of usuarios) {
    // 👇 Omitir al admin que está logueado
    if (usuario.id_usuario === adminActual.id_usuario) continue;

    const fila = await renderFila(usuario);
    tbody.appendChild(fila);
  }
};

async function renderFila(usuario) {
  const fila = document.createElement("tr");
  fila.classList.add("fila");

  const nombre_rol = await nombreRol(usuario.id_rol);

  const celdaTexto = (contenido) => {
    const td = document.createElement("td");
    td.classList.add("celda");
    td.textContent = contenido;
    return td;
  };

  const documento = celdaTexto(usuario.numero_documento);
  const nombre = celdaTexto(usuario.nombre);
  const apellido = celdaTexto(usuario.apellido);
  const correo = celdaTexto(usuario.correo);
  const contrasena = celdaTexto(usuario.contrasena);
  const telefono = celdaTexto(usuario.telefono);
  const rol = celdaTexto(nombre_rol);

  // Botón Editar
  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.classList.add("celda__boton");
  btnEditar.addEventListener("click", () => {
    window.location.hash = `#admin/usuarios/editar/${usuario.id_usuario}`;
  });

  const tdEditar = document.createElement("td");
  tdEditar.classList.add("celda");
  tdEditar.appendChild(btnEditar);

  // Botón Eliminar
  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.classList.add("celda__boton", "boton--rojo");
  btnEliminar.addEventListener("click", () => {
    confirmarAccion(
      "Espera",
      `¿Deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`,
      async () => {
        const res = await del(`usuarios/${usuario.id_usuario}`);
        if (res.ok) {
          fila.remove(); // Elimina la fila directamente
          alertaExito("Usuario eliminado correctamente");
        } else {
          alertaError("No se pudo eliminar el usuario");
        }
      }
    );
  });

  const tdEliminar = document.createElement("td");
  tdEliminar.classList.add("celda");
  tdEliminar.appendChild(btnEliminar);

  fila.append(documento, nombre, apellido, correo, contrasena, telefono, rol, tdEditar, tdEliminar);
  return fila;
}
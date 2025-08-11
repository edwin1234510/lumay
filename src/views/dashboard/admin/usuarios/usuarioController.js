import { nombreRol } from "../../../../validaciones/validacion.js";
import { confirmarAccion, alertaExito, alertaError } from "../../../../componentes/sweetAlert.js";
import { put, get } from "../../../../utils/api.js"; // Importa put para actualizar

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

  // Aquí puedes hacer una función para obtener el nombre del estado, o asumir que viene en usuario
  // Por simplicidad, asumo que en usuario viene id_estado_usuario y nombre_estado
  const nombre_estado = usuario.nombre_estado || (usuario.id_estado_usuario === 1 ? "Activo" : "Inactivo");

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
  const telefono = celdaTexto(usuario.telefono);
  const rol = celdaTexto(nombre_rol);
  const estado = celdaTexto(nombre_estado);

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

  // Botón "Eliminar" (en realidad desactivar usuario)
  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.classList.add("celda__boton", "boton--rojo");
  btnEliminar.addEventListener("click", () => {
    confirmarAccion(
      "Espera",
      `¿Deseas desactivar al usuario ${usuario.nombre} ${usuario.apellido}?`,
      async () => {
        const usuarioActualizado = { ...usuario, id_estado_usuario: 2 };
        try {
          const res = await put(`usuarios/${usuario.id_usuario}/estado`, usuarioActualizado);
          if (res.ok) {
            alertaExito("Usuario desactivado correctamente");
  
            // Actualizar el texto del estado en la fila sin recargar
            // Asumiendo que el 'estado' es la celda creada arriba
            estado.textContent = "Inactivo";
  
            // Opcional: deshabilitar el botón eliminar o cambiar texto para no desactivar más
            btnEliminar.disabled = true;
            btnEliminar.textContent = "Desactivado";
          } else {
            alertaError("No se pudo desactivar el usuario");
          }
        } catch (error) {
          alertaError("Error al desactivar el usuario");
        }
      }
    );
  });

  const tdEliminar = document.createElement("td");
  tdEliminar.classList.add("celda");
  tdEliminar.appendChild(btnEliminar);

  fila.append(documento, nombre, apellido, correo, telefono, rol, estado, tdEditar, tdEliminar);
  return fila;
}

import { nombreRol } from "../../../../validaciones/validacion.js"; 
import { confirmarAccion, alertaExito, alertaError } from "../../../../componentes/sweetAlert.js";
import { put, get } from "../../../../utils/api.js"; // Importa put para actualizar

/**
 * Controlador principal de usuarios.
 * 
 * - Obtiene el listado de usuarios desde la API.
 * - Renderiza la tabla de usuarios en el DOM.
 * - Omite al administrador que está logueado para evitar que se edite a sí mismo.
 * 
 * @returns {Promise<void>} No retorna directamente. Sus efectos son:
 *  - Insertar filas en la tabla de usuarios.
 *  - Interacciones con la API para listar datos.
 */
export const usuarioController = async () => {
  // Se obtiene el admin logueado desde localStorage (para no incluirlo en la tabla)
  const adminActual = JSON.parse(localStorage.getItem("usuario"));

  // Se obtienen todos los usuarios desde la API
  const usuarios = await get(`usuarios`);

  // Se selecciona el cuerpo de la tabla y se limpia en caso de recarga
  const tbody = document.querySelector(".tabla__cuerpo");
  tbody.innerHTML = ""; 

  // Se recorren los usuarios obtenidos
  for (const usuario of usuarios) {
    // Si el usuario actual es el admin logueado, se omite
    if (usuario.id_usuario === adminActual.id_usuario) continue;

    // Se crea una fila para cada usuario mediante la función auxiliar
    const fila = await renderFila(usuario);

    // Se agrega la fila al cuerpo de la tabla
    tbody.appendChild(fila);
  }
};

/**
 * Renderiza una fila en la tabla de usuarios con toda la información correspondiente.
 * 
 * - Muestra documento, nombre, apellido, correo, teléfono, rol y estado.
 * - Incluye botones de edición y eliminación (desactivación del usuario).
 * 
 * @param {Object} usuario - Objeto con los datos de un usuario.
 * @returns {Promise<HTMLTableRowElement>} Devuelve una fila `<tr>` lista para ser insertada en la tabla.
 */
async function renderFila(usuario) {
  // Se crea la fila de la tabla
  const fila = document.createElement("tr");
  fila.classList.add("fila");

  // Se obtiene el nombre del rol del usuario desde la validación
  const nombre_rol = await nombreRol(usuario.id_rol);

  // Nombre del estado (si no viene, se infiere a partir del id_estado_usuario)
  const nombre_estado = usuario.nombre_estado || (usuario.id_estado_usuario === 1 ? "Activo" : "Inactivo");

  /**
   * Función auxiliar para crear celdas de texto de manera dinámica.
   * @param {string} contenido - Texto que se mostrará dentro de la celda.
   * @returns {HTMLTableCellElement} Una celda <td> con el texto.
   */
  const celdaTexto = (contenido) => {
    const td = document.createElement("td");
    td.classList.add("celda");
    td.textContent = contenido;
    return td;
  };

  // Celdas con la información básica del usuario
  const documento = celdaTexto(usuario.numero_documento);
  const nombre = celdaTexto(usuario.nombre);
  const apellido = celdaTexto(usuario.apellido);
  const correo = celdaTexto(usuario.correo);
  const telefono = celdaTexto(usuario.telefono);
  const rol = celdaTexto(nombre_rol);
  const estado = celdaTexto(nombre_estado);

  // 🔹 Botón "Editar"
  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.classList.add("celda__boton");

  // Al hacer clic, redirige a la vista de edición del usuario
  btnEditar.addEventListener("click", () => {
    window.location.hash = `#admin/usuarios/editar/${usuario.id_usuario}`;
  });

  const tdEditar = document.createElement("td");
  tdEditar.classList.add("celda");
  tdEditar.appendChild(btnEditar);

  // 🔹 Botón "Eliminar" (desactiva el usuario en lugar de borrarlo definitivamente)
  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.classList.add("celda__boton", "boton--rojo");

  // Al hacer clic, muestra un cuadro de confirmación antes de desactivar al usuario
  btnEliminar.addEventListener("click", () => {
    confirmarAccion(
      "Espera",
      `¿Deseas desactivar al usuario ${usuario.nombre} ${usuario.apellido}?`,
      async () => {
        // Se crea un objeto actualizado con el estado cambiado a "Inactivo"
        const usuarioActualizado = { ...usuario, id_estado_usuario: 2 };

        try {
          // Petición a la API para actualizar el estado del usuario
          const res = await put(`usuarios/${usuario.id_usuario}/estado`, usuarioActualizado);

          // Si la petición es exitosa, se actualiza la vista y se muestra alerta
          alertaExito("Usuario desactivado correctamente");
          estado.textContent = "Inactivo";
        } catch (error) {
          // Si ocurre un error, se muestra alerta de error
          alertaError("No se pudo desactivar el usuario");
          console.error(error);
        }
      }
    );
  });

  const tdEliminar = document.createElement("td");
  tdEliminar.classList.add("celda");
  tdEliminar.appendChild(btnEliminar);

  // Se construye la fila completa agregando todas las celdas
  fila.append(documento, nombre, apellido, correo, telefono, rol, estado, tdEditar, tdEliminar);

  // Retorna la fila ya lista para ser insertada en la tabla
  return fila;
}

import { alertaError, alertaExito, confirmarAccion } from "../../../../../componentes/sweetAlert.js";
import { del, get } from "../../../../../utils/api.js";
import { traerPerfo, traerMate } from "../../../../../validaciones/validacion.js";

/**
 * Controlador para mostrar los detalles de una reserva (cita).
 *
 * @async
 * @function detalleReservaController
 * @param {number} id_cita - ID de la cita cuyos detalles se van a mostrar.
 * @returns {Promise<void>} - No retorna un valor directo, pero:
 *                            - Renderiza dinámicamente una tabla con los detalles de la cita.
 *                            - Permite editar un detalle.
 *                            - Permite eliminar un detalle (con confirmación).
 *
 * Flujo de la función:
 * 1. Obtiene todos los detalles de citas desde la API.
 * 2. Filtra solo los detalles que pertenecen a la cita seleccionada.
 * 3. Crea dinámicamente una fila en la tabla por cada detalle.
 * 4. Permite editar un detalle (redirige a vista de edición).
 * 5. Permite eliminar un detalle (con validación para no dejar la cita vacía).
 */
export const detalleReservaController = async (id_cita) => {
  // Obtener todos los detalles de citas desde la API
  const citaDetalles = await get("citas/detalle");

  // Seleccionar el cuerpo de la tabla en el DOM
  const tbody = document.querySelector(".tabla__cuerpo");

  // Limpiar contenido previo de la tabla para evitar duplicados
  tbody.innerHTML = "";

  // Filtrar los detalles que corresponden a esta cita
  const detallesCita = citaDetalles.filter(d => d.id_cita == id_cita);

  // Recorrer cada detalle de la cita y crear una fila en la tabla
  for (const detalles of detallesCita) {
    const fila = document.createElement("tr");
    fila.classList.add("fila");

    // Crear las celdas de la fila
    const piercing = document.createElement("td");
    const material = document.createElement("td");
    const precio = document.createElement("td");
    const editar = document.createElement("td");
    const eliminar = document.createElement("td");

    // Crear botones para editar y eliminar
    const botonEditar = document.createElement("button");
    const botonEliminar = document.createElement("button");

    // Asignar clases a las celdas y botones para estilo
    piercing.classList.add("celda");
    material.classList.add("celda");
    precio.classList.add("celda");
    editar.classList.add("celda");
    eliminar.classList.add("celda");
    botonEditar.classList.add("celda__boton");
    botonEliminar.classList.add("celda__boton");

    // Texto visible de los botones
    botonEditar.textContent = "Editar";
    botonEliminar.textContent = "Eliminar";

    // Obtener información detallada de perforación y material
    const perforacion = await traerPerfo(detalles.id_piercing);
    const materiales = await traerMate(detalles.id_material);

    // Rellenar las celdas con la información obtenida
    piercing.textContent = perforacion.nombre_piercing;
    material.textContent = materiales.tipo_material;
    precio.textContent = perforacion.precio_piercing + materiales.precio_material;

    // Insertar botones en sus respectivas celdas
    editar.append(botonEditar);
    eliminar.append(botonEliminar);

    // Construir la fila con todas las celdas
    fila.append(piercing, material, precio, editar, eliminar);

    // Insertar la fila en la tabla
    tbody.append(fila);

    // Asignar atributos únicos a los botones (ID del detalle)
    botonEditar.setAttribute("id", detalles.id_detalle);
    botonEliminar.setAttribute("id", detalles.id_detalle);

    /**
     * Evento para editar un detalle de la cita.
     * Redirige a la vista de edición con el ID del detalle seleccionado.
     */
    botonEditar.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `#cliente/detalles/editar/${e.target.getAttribute("id")}`;
    });

    /**
     * Evento para eliminar un detalle de la cita.
     * Incluye validación para no permitir que se elimine si es el único detalle restante.
     */
    botonEliminar.addEventListener("click", (e) => {
      e.preventDefault();
    
      //  Validación: no permitir eliminar si solo queda un detalle en la cita
      if (detallesCita.length <= 1) {
        alertaError("No puedes eliminar esta perforación porque la cita quedaría vacía.");
        return;
      }
    
      const idDetalle = e.target.getAttribute("id");
    
      // Confirmación antes de eliminar
      confirmarAccion(
        "Espera",
        "¿Estás seguro de que deseas eliminar esta perforación?",
        async () => {
          try {
            // Petición DELETE a la API
            const response = await del("citas/detalle/" + idDetalle);
    
            if (response.ok) {
              // Si la eliminación fue exitosa, notificar y eliminar la fila del DOM
              alertaExito("Perforación eliminada correctamente");
              fila.remove();
            } else {
              // Si falla la eliminación, mostrar error
              alertaError("No se pudo eliminar la perforación");
            }
    
          } catch (error) {
            // Manejo de errores de red u otros
            console.error(error);
            alertaError(error.message || "Error al eliminar la perforación");
          }
        }
      );
    });
  }
};

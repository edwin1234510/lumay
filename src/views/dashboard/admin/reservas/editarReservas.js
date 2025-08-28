import { get, put } from "../../../../utils/api.js"; 
import { alertaExito, alertaError } from "../../../../componentes/sweetAlert.js";

/**
 * Controlador para la edición de reservas desde el panel de administración.
 *
 * - Obtiene una cita específica por su ID.
 * - Muestra la fecha y hora (no editables).
 * - Permite cambiar el estado de la cita a través de un combobox dinámico.
 * - Envía los cambios a la API para actualizar el estado de la cita.
 *
 * @async
 * @function editarReservasAdmin
 * @param {number|string} idCita - Identificador de la cita que se desea editar.
 * @returns {Promise<void>} No retorna un valor directo.
 *   Sus efectos son:
 *   - Mostrar los datos de la cita en el formulario.
 *   - Actualizar el estado de la cita en la API.
 *   - Redirigir al listado de reservas o mostrar mensajes de error/éxito.
 */
export const editarReservasAdmin = async (idCita) => {
  //  Buscar la cita en la API a partir del id recibido
  const cita = (await get("citas")).find(c => c.id_cita == idCita);
  
  //  Validar que la cita exista
  if (!cita) {
    alertaError("Cita no encontrada");
    return; // Detener ejecución si no existe
  }

  //  Obtener estados posibles desde la API (ej: Activa, Cancelada, Finalizada...)
  const estados = await get("estados_citas");

  //  Seleccionar los elementos del DOM que se van a rellenar
  const inputFecha = document.querySelector("#fecha");
  const inputHora = document.querySelector("#hora");
  const botonRegresar = document.querySelector("#Regresar");
  const formEditar = document.querySelector("#formEditar");

  //  Rellenar los inputs con los valores actuales de la cita
  inputFecha.value = cita.fecha;
  inputHora.value = cita.hora;

  //  La fecha y hora no se pueden modificar (solo se cambia el estado)
  inputFecha.disabled = true;
  inputHora.disabled = true;

  //  Crear dinámicamente el combo box (select) con los estados disponibles
  const selectEstado = document.createElement("select");
  selectEstado.id = "estado";
  selectEstado.classList.add("formulario__input");

  //  Rellenar el select con los estados
  estados.forEach(estado => {
    const option = document.createElement("option");
    option.value = estado.id_estado_cita;       // id del estado
    option.textContent = estado.nombre_estado;  // nombre visible
    // Seleccionar por defecto el estado actual de la cita
    if (estado.id_estado_cita === cita.id_estado_cita) {
      option.selected = true;
    }
    selectEstado.appendChild(option);
  });

  //  Insertar el combo justo después del input de hora
  inputHora.insertAdjacentElement("afterend", selectEstado);

  //  Botón para regresar al listado de reservas sin recargar la página
  botonRegresar.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = `#admin/reservas`;
  });

  //  Manejo del evento de submit (cuando el admin guarda cambios)
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Nuevo estado seleccionado en el combo
    const nuevoEstado = parseInt(selectEstado.value);

    // Objeto con la actualización a enviar a la API
    const citaActualizada = {
      id_estado_cita: nuevoEstado
    };

    try {
      //  Enviar actualización del estado de la cita a la API
      const response = await put(`citas/${idCita}/estado`, citaActualizada);

      //  Mensaje de éxito desde el backend
      const data = response.mensaje;
      alertaExito(data);

      console.log(data); // Útil para debug
    } catch (error) {
      //  Manejo de error en la petición
      console.error("Error actualizando la cita:", error);
      alertaError(error);
    }
  });
};

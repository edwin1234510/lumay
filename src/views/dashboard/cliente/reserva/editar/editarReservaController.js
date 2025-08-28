import { get, put } from "../../../../../utils/api.js"; 
import { alertaExito, alertaError } from "../../../../../componentes/sweetAlert.js";

/**
 * Controlador para editar una reserva existente.
 * 
 * @async
 * @function editarReservaController
 * @param {number} idCita - El ID de la cita que se desea editar.
 * @returns {Promise<void>} - No retorna ningún valor directo, 
 *                            pero actualiza los datos de la cita y muestra alertas al usuario.
 * 
 * Flujo de la función:
 * 1. Busca la cita por su ID en la API.
 * 2. Rellena los campos del formulario con los datos actuales de la cita.
 * 3. Permite regresar al listado de reservas sin recargar la página.
 * 4. Permite actualizar la fecha y hora de la cita en el servidor vía API.
 * 5. Muestra un mensaje de éxito o error dependiendo del resultado.
 */
export const editarReservaController = async (idCita) => {
  
  // Obtiene todas las citas desde la API y busca la que coincida con el ID recibido
  const cita = (await get("citas")).find(c => c.id_cita == idCita);

  // Si no existe la cita, muestra error y detiene la ejecución
  if (!cita) {
    alertaError("Cita no encontrada");
    return;
  }

  // Obtiene referencias a los elementos del DOM
  const inputFecha = document.querySelector("#fecha");
  const inputHora = document.querySelector("#hora");
  const botonRegresar = document.querySelector("#Regresar");
  const formEditar = document.querySelector("#formEditar");

  // Asigna los valores actuales de la cita en los inputs del formulario
  inputFecha.value = cita.fecha;
  inputHora.value = cita.hora;

  // Evento para regresar a la vista de reservas sin recargar la página
  botonRegresar.addEventListener("click", (e) => {
    e.preventDefault(); // Previene recarga de página
    location.hash = `#cliente/reserva`; // Redirige a la vista de reservas
  });

  // Evento para enviar el formulario y actualizar la cita
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene el envío tradicional del formulario

    // Obtiene los nuevos valores de fecha y hora desde el formulario
    const nuevaFecha = document.querySelector("#fecha").value;
    const nuevaHora = document.querySelector("#hora").value;

    // Construye el objeto con los datos actualizados
    const citaActualizada = {
      fecha: nuevaFecha,
      hora: nuevaHora
    };
    console.log(citaActualizada); // Muestra en consola el objeto que se enviará

    try {
      // Llama a la API para actualizar la cita con la nueva fecha y hora
      const response = await put(`citas/${idCita}/actualizar-fecha-hora`, citaActualizada);
      
      // Si la API responde correctamente, muestra alerta de éxito
      alertaExito("Se actualizó la cita correctamente");
    } catch (error) {
      // Si ocurre un error en la petición, se muestra en consola y alerta al usuario
      console.error(error);
      alertaError(error.message || "No fue posible actualizar la cita");
    }
  });
};

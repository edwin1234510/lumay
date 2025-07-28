import {  get, put } from "../../../../utils/api.js";
import { alertaExito, alertaError } from "../../../../componentes/sweetAlert.js";

export const editarReservasAdmin = async(idCita) =>{
    const cita = (await get("citas")).find(c => c.id_cita == idCita);

  if (!cita) {
    alertaError("Cita no encontrada");
    return;
  }

  // Rellenar campos
  const inputFecha = document.querySelector("#fecha");
  const inputHora = document.querySelector("#hora");
  const botonRegresar = document.querySelector("#Regresar");
  const formEditar = document.querySelector("#formEditar");

  inputFecha.value = cita.fecha;
  inputHora.value = cita.hora;

  // Evento para regresar sin recargar
  botonRegresar.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = `#admin/reservas`;
  });

  // Evento submit
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevaFecha = inputFecha.value;
    const nuevaHora = inputHora.value;

    const formatHora = (hora) => {
      const [h, m] = hora.split(":");
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    };
    
    const citaActualizada = {
      fecha: nuevaFecha,
      hora: formatHora(nuevaHora),
      id_usuario: cita.id_usuario
    };
    console.log(citaActualizada);
    
    try {
      const response = await put(`citas/${idCita}`, citaActualizada);

      if (response.ok) {
        alertaExito("Cita actualizada correctamente");
      } else if (response.status === 409) {
        const mensaje = await response.text();
        alertaError("Ya existe una cita en ese horario: " + mensaje);
      } else {
        alertaError("Error al actualizar la cita.");
      }

    } catch (error) {
      console.error("Error actualizando la cita:", error);
      alertaError("Error inesperado al actualizar la cita.");
    }
  });
}
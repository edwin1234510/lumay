import {  get, put } from "../../../../../utils/api.js";
import { alertaExito, alertaError } from "../../../../../componentes/sweetAlert.js";

export const editarReservaController = async (idCita) => {
  
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
    location.hash = `#cliente/reserva`;
  });

  // Evento submit
  formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevaFecha = document.querySelector("#fecha").value;
  const nuevaHora = document.querySelector("#hora").value;

  const citaActualizada = {
    fecha: nuevaFecha,
    hora: nuevaHora
  };
  console.log(citaActualizada);
  
  try {
    const response = await put(`citas/${idCita}/actualizar-fecha-hora`, citaActualizada);
  
    if (response.ok) {
      alertaExito("Fecha y hora actualizadas correctamente");
    } else if (response.status === 409) {  // Conflicto de horario detectado por el backend
      const data = await response.json();
      alertaError(data.error || "La nueva fecha/hora se solapa con otra cita.");
    } else {
      alertaError("Error al actualizar la fecha y hora.");
    }
  } catch (error) {
    console.error("Error actualizando la cita:", error);
    alertaError("Error inesperado al actualizar la cita.");
  }
  
});
};

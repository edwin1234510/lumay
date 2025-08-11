import { get, put } from "../../../../utils/api.js";
import { alertaExito, alertaError } from "../../../../componentes/sweetAlert.js";

export const editarReservasAdmin = async (idCita) => {
  const cita = (await get("citas")).find(c => c.id_cita == idCita);
  
  if (!cita) {
    alertaError("Cita no encontrada");
    return;
  }

  // Obtener estados desde la API
  const estados = await get("estados_citas");

  // Rellenar campos
  const inputFecha = document.querySelector("#fecha");
  const inputHora = document.querySelector("#hora");
  const botonRegresar = document.querySelector("#Regresar");
  const formEditar = document.querySelector("#formEditar");

  inputFecha.value = cita.fecha;
  inputHora.value = cita.hora;

  // Deshabilitar para que no se puedan editar
  inputFecha.disabled = true;
  inputHora.disabled = true;

  // Crear combo box para estados
  const selectEstado = document.createElement("select");
  selectEstado.id = "estado";
  selectEstado.classList.add("formulario__input");

  estados.forEach(estado => {
    const option = document.createElement("option");
    option.value = estado.id_estado_cita;
    option.textContent = estado.nombre_estado;
    if (estado.id_estado_cita === cita.id_estado_cita) {
      option.selected = true;
    }
    selectEstado.appendChild(option);
  });

  // Insertar el combo justo después del inputHora
  inputHora.insertAdjacentElement("afterend", selectEstado);

  // Evento para regresar sin recargar
  botonRegresar.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = `#admin/reservas`;
  });

  // Evento submit
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoEstado = parseInt(selectEstado.value);

    const citaActualizada = {
      id_estado_cita: nuevoEstado
    };

    try {
      const response = await put(`citas/${idCita}/estado`, citaActualizada);
    
      if (response.ok) {
        alertaExito("Cita actualizada correctamente");
      } else if (response.status === 409) {
        const data = await response.json(); // Leer mensaje del backend
        alertaError(data.error || "Ya existe una cita en ese horario.");
      } else {
        const data = await response.json().catch(() => ({}));
        alertaError(data.error || "Error al actualizar la cita.");
      }
    } catch (error) {
      console.error("Error actualizando la cita:", error);
      alertaError("Error inesperado al actualizar la cita.");
    }
  });
};

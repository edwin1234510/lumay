import { alertaError } from "../../../../componentes/sweetAlert";
import { get } from "../../../../utils/api"; // ruta ajustada si es necesario

export const agendarCitaController = async () => {
  const formulario = document.querySelector("#formCita");
  const fechaInput = document.querySelector("#fecha");
  const horaInput = document.querySelector("#hora");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fecha = fechaInput.value;
    const hora = horaInput.value;
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!fecha || !hora) {
      alertaError("Por favor selecciona la fecha y la hora");
      return;
    }

    if (!usuario || !usuario.id_usuario) {
      alertaError("No se encontró el usuario en sesión");
      return;
    }

    // Verificar disponibilidad
    try {
      const url = `citas/disponible?fecha=${fecha}&hora=${hora}&duracion=15`;
      const disponible = await get(url);

      if (!disponible) {
        alertaError("Ya existe una cita en ese horario. Elige otra hora.");
        return;
      }

      const citaParcial = {
        id_usuario: usuario.id_usuario,
        fecha,
        hora,
        estado: "pendiente"
      };

      localStorage.setItem("cita_parcial", JSON.stringify(citaParcial));

      // 🔁 Cambio aquí: en lugar de redireccionar por href, usamos hash
      location.hash = "#cliente/agendar/perforacion";

    } catch (error) { 
      console.error("Error al verificar disponibilidad:", error);
      alertaError("No se pudo verificar la disponibilidad. Intenta más tarde.");
    }
  });
};
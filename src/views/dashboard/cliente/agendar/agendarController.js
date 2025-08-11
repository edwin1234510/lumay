import { alertaError } from "../../../../componentes/sweetAlert";
import { get } from "../../../../utils/api";

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

    try {
      // 1️⃣ Validar reglas de fecha/hora
      const validarUrl = `http://localhost:8080/LumayJava/api/citas/validar_fecha?fecha=${encodeURIComponent(fecha)}&hora=${encodeURIComponent(hora)}`;
      const respValidar = await fetch(validarUrl);

      if (!respValidar.ok) {
        const mensaje = await respValidar.text();
        alertaError(mensaje);
        return;
      }

      // 2️⃣ Verificar disponibilidad
      const urlDisponible = `citas/disponible?fecha=${fecha}&hora=${hora}&duracion=15`;
      const disponible = await get(urlDisponible);

      if (!disponible) {
        alertaError("Ya existe una cita en ese horario. Elige otra hora.");
        return;
      }

      // 3️⃣ Guardar datos y continuar
      const citaParcial = {
        id_usuario: usuario.id_usuario,
        fecha,
        hora,
        id_estado_cita: 1
      };

      localStorage.setItem("cita_parcial", JSON.stringify(citaParcial));
      location.hash = "#cliente/agendar/perforacion";

    } catch (error) { 
      console.error("Error al agendar:", error);
      alertaError("Ocurrió un error. Intenta más tarde.");
    }
  });
};

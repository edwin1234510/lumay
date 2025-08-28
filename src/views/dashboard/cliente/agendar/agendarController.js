import { alertaError } from "../../../../componentes/sweetAlert"; 
import { get } from "../../../../utils/api";

/**
 * Controlador para gestionar el flujo de agendamiento de citas.
 * 
 * - Se encarga de escuchar el envío del formulario de cita.
 * - Valida que la fecha y la hora sean correctas.
 * - Verifica la disponibilidad del horario.
 * - Si todo es correcto, guarda los datos de la cita en el localStorage
 *   para continuar con el siguiente paso del proceso.
 * 
 * @returns {void} No retorna ningún valor directo. 
 *                 El resultado es la actualización del localStorage 
 *                 y la redirección de la vista si el proceso es exitoso.
 */
export const agendarCitaController = async () => {
  // Selecciona el formulario y los campos de entrada (fecha y hora)
  const formulario = document.querySelector("#formCita");
  const fechaInput = document.querySelector("#fecha");
  const horaInput = document.querySelector("#hora");

  // Agrega un "listener" para manejar el envío del formulario
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que se recargue la página al enviar el formulario

    // Obtiene valores del formulario y del usuario en sesión
    const fecha = fechaInput.value;
    const hora = horaInput.value;
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Validación básica: fecha y hora no pueden estar vacías
    if (!fecha || !hora) {
      alertaError("Por favor selecciona la fecha y la hora");
      return; // Se corta el flujo si falta información
    }

    // Validación de sesión: debe existir un usuario con ID válido
    if (!usuario || !usuario.id_usuario) {
      alertaError("No se encontró el usuario en sesión");
      return;
    }

    try {
      //  Validar reglas de fecha/hora en el backend
      // Se consulta la API para verificar que la fecha/hora cumplen las reglas
      const validarUrl = `http://localhost:8080/LumayJava/api/citas/validar_fecha?fecha=${encodeURIComponent(fecha)}&hora=${encodeURIComponent(hora)}`;
      const respValidar = await fetch(validarUrl);

      // Si la validación no es exitosa, se muestra el error y se corta el flujo
      if (!respValidar.ok) {
        const mensaje = await respValidar.text();
        alertaError(mensaje);
        return;
      }

      //  Verificar disponibilidad de la cita
      // Se consulta al backend si el horario está libre (duración fija de 15 min)
      const urlDisponible = `citas/disponible?fecha=${fecha}&hora=${hora}&duracion=15`;
      const disponible = await get(urlDisponible);

      // Si no hay disponibilidad, se informa al usuario
      if (!disponible) {
        alertaError("Ya existe una cita en ese horario. Elige otra hora.");
        return;
      }

      //  Guardar datos de la cita en estado "parcial"
      // Se construye un objeto con los datos de la cita
      const citaParcial = {
        id_usuario: usuario.id_usuario, // ID del usuario en sesión
        fecha,                          // Fecha seleccionada
        hora,                           // Hora seleccionada
        id_estado_cita: 1               // Estado inicial de la cita (ej. "pendiente")
      };

      // Se guarda la cita en el localStorage para recuperarla en el siguiente paso
      localStorage.setItem("cita_parcial", JSON.stringify(citaParcial));

      // Se redirige al siguiente formulario (#cliente/agendar/perforacion)
      location.hash = "#cliente/agendar/perforacion";

    } catch (error) { 
      //  Manejo de errores generales (ej. problema de conexión con backend)
      alertaError("Ocurrió un error. Intenta más tarde.");
    }
  });
};

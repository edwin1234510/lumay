import { get, put } from "../../../../utils/api.js"; 
import { alertaExito, alertaError, alertaEditarEliminar } from "../../../../componentes/sweetAlert.js";
import { nombreUsuario } from "../../../../validaciones/validacion.js";

/**
 * Controlador del calendario de administración.
 *
 * - Obtiene las citas desde la API.
 * - Renderiza el calendario usando FullCalendar.
 * - Permite ver el detalle de una cita al hacer clic.
 * - Brinda opciones para editar la cita o cancelar (actualizar estado).
 *
 * @async
 * @function adminCalendarioController
 * @returns {Promise<void>} No retorna un valor directo.
 *   Sus efectos son:
 *   - Renderizar el calendario con las citas.
 *   - Abrir un modal con detalle de la cita seleccionada.
 *   - Redirigir a la edición de una cita o actualizar su estado en la API.
 */
export const adminCalendarioController = async () => {
  //  Seleccionar el contenedor donde se va a renderizar el calendario
  const calendarEl = document.getElementById("calendar");

  //  Obtener citas desde la API
  const citas = await get("citas");

  //  Transformar las citas en eventos compatibles con FullCalendar
  const eventos = citas.map(cita => ({
    id: cita.id_cita, // Identificador único del evento
    title: `Cita : ${cita.nombre_estado}`, // Título del evento (ej: "Cita : Activa")
    start: `${cita.fecha}T${cita.hora}`, // Fecha y hora en formato ISO
    classNames: [cita.nombre_estado.toLowerCase()], // Clase CSS según estado (ej: "activa", "cancelada")
    extendedProps: { // Propiedades adicionales para usar después
      estado: cita.nombre_estado,
      nombre: cita.nombre
    }
  }));

  //  Inicializar el calendario con configuración personalizada
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth", // Vista inicial: mes
    locale: "es", // Idioma: español
    headerToolbar: { // Configuración de botones en el encabezado
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth"
    },
    buttonText: { // Traducción de los botones
      today: 'Hoy',
      month: 'Mes',
      list: 'Lista'
    },
    events: eventos, // Pasar los eventos procesados al calendario

    /**
     *  Acción al hacer clic sobre un evento del calendario.
     * - Muestra un modal con la información de la cita.
     * - Permite editarla o cancelar la cita.
     */
    eventClick: async function(info) {
      const idCita = info.event.id; // ID de la cita seleccionada

      // Obtener la cita completa desde la API (para asegurar datos actualizados)
      const citas = await get("citas");
      const cita = citas.find(c => c.id_cita == idCita);

      // Obtener el nombre del usuario dueño de la cita
      const nombre = await nombreUsuario(cita.id_usuario);

      // Mostrar modal con información y opciones (editar / cancelar)
      await alertaEditarEliminar(
        "Cita seleccionada",
        `
          <b>Usuario:</b> ${nombre}<br>
          <b>Estado:</b> ${cita.nombre_estado}<br>
          <b>Fecha:</b> ${cita.fecha}<br>
          <b>Hora:</b> ${cita.hora}
        `,
        () => {
          //  Acción si elige "Editar"
          window.location.hash = `#admin/reservas/editar/${idCita}`;
        },
        async () => {
          //  Acción si elige "Cancelar cita"
          const body = { id_estado_cita: 3 }; // Estado 3 = Cancelada

          try {
            // Actualizar estado en la API
            await put(`citas/${idCita}/estado`, body);

            // Mostrar mensaje de éxito
            alertaExito("Se canceló la cita");

            // Actualizar el evento en el calendario sin recargar
            info.event.setProp("title", `Cita : Cancelada`);
            info.event.setProp("classNames", ["cancelada"]);
            info.event.setExtendedProp("estado", "Cancelada");
          } catch (error) {
            // Manejo de error en la API
            alertaError("No se pudo actualizar el estado");
            console.error(error);
          }
        }
      );
    }
  });

  //  Renderizar el calendario en pantalla
  calendar.render();
};

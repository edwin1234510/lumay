import { get, put } from "../../../../utils/api.js";
import { alertaExito, alertaError, alertaEditarEliminar } from "../../../../componentes/sweetAlert.js";
import { nombreUsuario } from "../../../../validaciones/validacion.js";

export const adminCalendarioController = async () => {
  const calendarEl = document.getElementById("calendar");

  const citas = await get("citas");
  const eventos = citas.map(cita => ({
    id: cita.id_cita,
    title: `Cita : ${cita.nombre_estado}`,
    start: `${cita.fecha}T${cita.hora}`,
    classNames: [cita.nombre_estado.toLowerCase()],
    extendedProps: {
      estado: cita.nombre_estado,
      nombre: cita.nombre
    }
  }));

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth"
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      list: 'Lista'
    },
    events: eventos,
    eventClick: async function(info) {
      const idCita = info.event.id;
      const citas = await get("citas");
      const cita = citas.find(c => c.id_cita == idCita);
      const nombre = await nombreUsuario(cita.id_usuario);

      await alertaEditarEliminar(
        "Cita seleccionada",
        `
          <b>Usuario:</b> ${nombre}<br>
          <b>Estado:</b> ${cita.nombre_estado}<br>
          <b>Fecha:</b> ${cita.fecha}<br>
          <b>Hora:</b> ${cita.hora}
        `,
        () => {
          // Acción si elige "Editar"
          window.location.hash = `#admin/editar-cita/${idCita}`;
        },
        async () => {
          // Acción si confirma "Actualizar estado"
          const body = {
            id_estado_cita: 3
          };

          const res = await put(`citas/${idCita}/estado`, body);
          if (res.ok) {
            alertaExito("Se cancelo la cita");
            info.event.setProp("title", `Cita : Cancelada`);
            info.event.setProp("classNames", ["cancelada"]);
            info.event.setExtendedProp("estado", "Cancelada");
          } else {
            alertaError("No se pudo actualizar el estado");
          }
        }
      );
    }
  });

  calendar.render();
};

import { alertaInfo, confirmarAccion } from "../../../../componentes/sweetAlert";
import { del, get, put } from "../../../../utils/api";

function formatearFechaHora(fechaStr, horaStr) {
  const fecha = new Date(`${fechaStr}T${horaStr}`);
  const fechaFormateada = fecha.toLocaleDateString("es-CO");
  const horaFormateada = fecha.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { fechaFormateada, horaFormateada };
}

export const reservaController = async (main) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const citas = await get("citas");
  const ahora = new Date();

  main.innerHTML = "";

  const contenedorPrincipal = document.createElement("div");
  contenedorPrincipal.classList.add("main-container");

  let tieneCitas = false;

  for (const cita of citas) {
    if (usuario.id_usuario !== cita.id_usuario) continue;

    tieneCitas = true;

    const fechaHoraCita = new Date(`${cita.fecha}T${cita.hora}:00`);
    if (cita.estado === "pendiente" && ahora > fechaHoraCita) {
      const actualizacion = {
        fecha: cita.fecha,
        hora: cita.hora,
        estado: "completada",
      };
      await put(`citas/${cita.id_cita}`, actualizacion);
      cita.estado = "completada";
    }

    const { fechaFormateada, horaFormateada } = formatearFechaHora(cita.fecha, cita.hora);

    const item = document.createElement("div");
    item.classList.add("reserva");
    item.dataset.id = cita.id_cita;

    const derecha = document.createElement("div");
    derecha.classList.add("reserva__detalle");
    derecha.innerHTML = `
      <p class="reserva__texto">Fecha: ${fechaFormateada}</p>
      <p class="reserva__texto">Hora: ${horaFormateada}</p>
    `;

    const centro = document.createElement("div");
    centro.classList.add("reserva__acciones");

    const btnDetalles = document.createElement("button");
    btnDetalles.classList.add("reserva__boton");
    btnDetalles.textContent = "Detalles";
    btnDetalles.addEventListener("click", () => {
      window.location.hash = `cliente/detalles/${cita.id_cita}`;
    });
    centro.appendChild(btnDetalles);

    const izquierda = document.createElement("div");
    izquierda.classList.add("reserva__estado");

    if (cita.estado === "completada") {
      const estadoTexto = document.createElement("p");
      estadoTexto.classList.add("reserva__estado-texto");
      estadoTexto.textContent = "completada";
      izquierda.appendChild(estadoTexto);
    } else {
      const btnEditar = document.createElement("button");
      btnEditar.classList.add("reserva__boton");
      btnEditar.textContent = "Editar";
      btnEditar.addEventListener("click", () => {
        window.location.hash = `#cliente/reserva/editar/${cita.id_cita}`;
      });

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("reserva__boton");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () => {
        confirmarAccion("Eliminar cita", "¿Estás seguro de que deseas eliminar esta cita?", async () => {
          const res = await del(`citas/${cita.id_cita}`);
          if (res.ok) {
            const elemento = document.querySelector(`[data-id='${cita.id_cita}']`);
            if (elemento) elemento.remove();
          } else {
            alert("No se pudo eliminar la cita");
          }
        });
      });

      izquierda.append(btnEditar, btnEliminar);
    }

    item.append(derecha, centro, izquierda);
    contenedorPrincipal.appendChild(item);
  }

  if (!tieneCitas) {
    alertaInfo(
      "¡Sin reservas!",
      "Aún no has agendado una cita. ¡Te esperamos para reservar tu próxima experiencia!"
    );
  }

  main.appendChild(contenedorPrincipal);
};

import { alertaInfo, confirmarAccion } from "../../../../componentes/sweetAlert";
import { get, post, put } from "../../../../utils/api";

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

async function crearFacturaSiNoExiste(idCita) {
  const facturas = await get("facturas");
  const facturaExistente = facturas.find(f => f.idCita === idCita); // Cambiado a idCita
  if (facturaExistente) {
    return facturaExistente;
  }

  const listaPiercings = await get("piercings");
  const listaMateriales = await get("materiales");
  const detalles = await get("citas/detalle");
  const detallesCita = detalles.filter(d => d.id_cita === idCita);

  let total = 0;
  for (const d of detallesCita) {
    const piercing = listaPiercings.find(p => p.id_piercing === d.id_piercing);
    const material = listaMateriales.find(m => m.id_material === d.id_material);
    total += (piercing?.precio_piercing || 0) + (material?.precio_material || 0);
  }

  await post("facturas", { idCita, total });
  return { idCita, total };
}

async function mostrarFacturaInfo(idCita) {
  const facturas = await get("facturas");
  const factura = facturas.find(f => f.idCita === idCita);

  if (factura) {
    alertaInfo("Factura de la cita", `Total: $ ${factura.total.toFixed(0)}`);
  } else {
    alertaInfo("Factura", "No se encontró la factura para esta cita.");
  }
}

export const reservaController = async (main) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const citas = await get("citas");

  main.innerHTML = "";
  const contenedorPrincipal = document.createElement("div");
  contenedorPrincipal.classList.add("main-container");

  let tieneCitas = false;

  for (const cita of citas) {
    if (usuario.id_usuario !== cita.id_usuario) continue;
    tieneCitas = true;

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

    const izquierda = document.createElement("div");
    izquierda.classList.add("reserva__estado");

    const estado = cita.nombre_estado.toLowerCase();

    if (estado === "completada") {
      // Crear factura si no existe
      await crearFacturaSiNoExiste(cita.id_cita);

      const btnFactura = document.createElement("button");
      btnFactura.classList.add("reserva__boton");
      btnFactura.textContent = "Factura";
      btnFactura.addEventListener("click", () => mostrarFacturaInfo(cita.id_cita));

      const estadoTexto = document.createElement("p");
      estadoTexto.classList.add("reserva__estado-texto");
      estadoTexto.textContent = "Completada";

      izquierda.appendChild(estadoTexto);
      centro.appendChild(btnFactura);
      centro.style.justifyContent = "center"; // Centrar el botón
    } 
    else if (estado === "cancelada") {
      const btnDetalles = document.createElement("button");
      btnDetalles.classList.add("reserva__boton");
      btnDetalles.textContent = "Detalles";
      btnDetalles.disabled = true;

      const estadoTexto = document.createElement("p");
      estadoTexto.classList.add("reserva__estado-cancelado");
      estadoTexto.textContent = "Cancelada";
      izquierda.appendChild(estadoTexto);

      centro.appendChild(btnDetalles);
    } 
    else if (estado === "pendiente") {
      const btnDetalles = document.createElement("button");
      btnDetalles.classList.add("reserva__boton");
      btnDetalles.textContent = "Detalles";
      btnDetalles.addEventListener("click", () => {
        window.location.hash = `cliente/detalles/${cita.id_cita}`;
      });

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
        confirmarAccion(
          "Eliminar cita",
          "¿Estás seguro de que deseas eliminar esta cita?",
          async () => {
            const objeto = { id_estado_cita: 3 }; 
            const res = await put(`citas/${cita.id_cita}/estado`, objeto);
            if (res.ok) {
              const elemento = document.querySelector(`[data-id='${cita.id_cita}']`);
              if (elemento) {
                const izquierda = elemento.querySelector(".reserva__estado");
                izquierda.innerHTML = "";
                const estadoTexto = document.createElement("p");
                estadoTexto.classList.add("reserva__estado-texto");
                estadoTexto.textContent = "Cancelada";
                izquierda.appendChild(estadoTexto);
                const btnDetallesEnUI = elemento.querySelector(".reserva__acciones .reserva__boton");
                if (btnDetallesEnUI) {
                  btnDetallesEnUI.disabled = true;
                  btnDetallesEnUI.classList.add("boton--deshabilitado");
                }
              }
            } else {
              alert("No se pudo eliminar la cita");
            }
          }
        );
      });

      centro.appendChild(btnDetalles);
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

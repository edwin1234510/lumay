import { alertaInfo, confirmarAccion } from "../../../../componentes/sweetAlert"; 
import { get, post, put } from "../../../../utils/api";

/**
 * Formatea una fecha y hora a formato legible en español (CO).
 *
 * @function formatearFechaHora
 * @param {string} fechaStr - Fecha en formato ISO (ej: "2025-08-27").
 * @param {string} horaStr - Hora en formato HH:MM (ej: "14:30").
 * @returns {Object} - Objeto con:
 *   - {string} fechaFormateada → Fecha formateada en formato regional.
 *   - {string} horaFormateada → Hora formateada en formato de 12 horas con AM/PM.
 */
function formatearFechaHora(fechaStr, horaStr) {
  // Crear objeto Date a partir de fecha y hora concatenadas
  const fecha = new Date(`${fechaStr}T${horaStr}`);

  // Formatear fecha en español (Colombia)
  const fechaFormateada = fecha.toLocaleDateString("es-CO");

  // Formatear hora en formato 12h con minutos
  const horaFormateada = fecha.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { fechaFormateada, horaFormateada };
}

/**
 * Crea una factura para una cita si aún no existe.
 *
 * @async
 * @function crearFacturaSiNoExiste
 * @param {number} idCita - ID de la cita.
 * @returns {Promise<Object>} - Devuelve la factura existente o una nueva con:
 *   - {number} idCita → ID de la cita.
 *   - {number} total → Monto total calculado.
 */
async function crearFacturaSiNoExiste(idCita) {
  const facturas = await get("facturas");

  // Verificar si ya existe una factura asociada a esta cita
  const facturaExistente = facturas.find(f => f.idCita === idCita);
  if (facturaExistente) {
    return facturaExistente;
  }

  // Si no existe factura, calcular total a partir de los detalles de la cita
  const listaPiercings = await get("piercings");
  const listaMateriales = await get("materiales");
  const detalles = await get("citas/detalle");
  const detallesCita = detalles.filter(d => d.id_cita === idCita);

  let total = 0;

  // Sumar precio de piercing + material por cada detalle
  for (const d of detallesCita) {
    const piercing = listaPiercings.find(p => p.id_piercing === d.id_piercing);
    const material = listaMateriales.find(m => m.id_material === d.id_material);

    total += (piercing?.precio_piercing || 0) + (material?.precio_material || 0);
  }

  // Guardar nueva factura en el backend
  await post("facturas", { idCita, total });
  return { idCita, total };
}

/**
 * Muestra en pantalla la información de una factura asociada a una cita.
 *
 * @async
 * @function mostrarFacturaInfo
 * @param {number} idCita - ID de la cita a consultar.
 * @returns {Promise<void>} - No retorna nada, muestra una alerta informativa.
 */
async function mostrarFacturaInfo(idCita) {
  const facturas = await get("facturas");
  const detalles = await get("citas/detalle");
  const piercings = await get("piercings");
  const materiales = await get("materiales");

  // Buscar factura de la cita
  const factura = facturas.find(f => f.idCita === idCita);

  // Filtrar todos los detalles de esa cita
  const detallesCita = detalles.filter(d => d.id_cita === idCita);

  // Construir el texto de la factura
  let textoDetalles = "";
  detallesCita.forEach(d => {
    const piercing = piercings.find(p => p.id_piercing === d.id_piercing);
    if (piercing) {
      textoDetalles += `- ${piercing.nombre_piercing} | Precio: $${piercing.precio_piercing.toFixed(0)}<br>`;
    }
    const material = materiales.find(m => m.id_material === d.id_material);
    if(material){
      textoDetalles += `- ${material.tipo_material} | Precio: $${material.precio_material.toFixed(0)}<br>`;
    }
  });
  let mensajeCompleto = textoDetalles+"<br><b>Total:</b> $"+factura.total.toFixed(0);
  // Mostrar información
  if (factura) {
    alertaInfo(
      "Factura de la cita",
      mensajeCompleto
    );
  } else {
    alertaInfo("Factura", "No se encontró la factura para esta cita.");
  }
}


/**
 * Controlador de reservas del cliente.
 * 
 * Este controlador:
 *  - Obtiene todas las citas del backend.
 *  - Filtra y muestra solo las del usuario logueado.
 *  - Renderiza en el DOM la lista de reservas con sus acciones según el estado:
 *      ✔ Completada → Botón de factura.
 *      ❌ Cancelada → Botón deshabilitado.
 *      ⏳ Pendiente → Botones de Detalles, Editar y Eliminar.
 *  - Permite cancelar citas (actualiza estado en backend y en la UI).
 *  - Muestra mensaje si el usuario no tiene citas.
 * 
 * @async
 * @function reservaController
 * @param {HTMLElement} main - Contenedor principal donde se renderiza la información.
 * @returns {Promise<void>} - No retorna nada, modifica dinámicamente el DOM.
 */
export const reservaController = async (main) => {
  // Obtener usuario logueado desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Traer todas las citas
  const citas = await get("citas");

  // Limpiar contenedor principal
  main.innerHTML = "";

  // Crear contenedor general para las reservas
  const contenedorPrincipal = document.createElement("div");
  contenedorPrincipal.classList.add("main-container");

  let tieneCitas = false;

  // Iterar sobre cada cita
  for (const cita of citas) {
    // Solo mostrar las citas que pertenecen al usuario actual
    if (usuario.id_usuario !== cita.id_usuario) continue;
    tieneCitas = true;

    // Formatear fecha y hora
    const { fechaFormateada, horaFormateada } = formatearFechaHora(cita.fecha, cita.hora);

    // Crear contenedor de la reserva
    const item = document.createElement("div");
    item.classList.add("reserva");
    item.dataset.id = cita.id_cita;

    // Sección derecha: Detalles de fecha y hora
    const derecha = document.createElement("div");
    derecha.classList.add("reserva__detalle");
    derecha.innerHTML = `
      <p class="reserva__texto">Fecha: ${fechaFormateada}</p>
      <p class="reserva__texto">Hora: ${horaFormateada}</p>
    `;

    // Sección central: Acciones (botones dinámicos según estado)
    const centro = document.createElement("div");
    centro.classList.add("reserva__acciones");

    // Sección izquierda: Estado de la cita
    const izquierda = document.createElement("div");
    izquierda.classList.add("reserva__estado");

    // Determinar estado de la cita
    const estado = cita.nombre_estado.toLowerCase();

    if (estado === "completada") {
      // 👉 Si está completada, asegurarse de que tenga factura
      await crearFacturaSiNoExiste(cita.id_cita);

      // Botón para mostrar factura
      const btnFactura = document.createElement("button");
      btnFactura.classList.add("reserva__boton");
      btnFactura.textContent = "Factura";
      btnFactura.addEventListener("click", () => mostrarFacturaInfo(cita.id_cita));

      // Texto de estado
      const estadoTexto = document.createElement("p");
      estadoTexto.classList.add("reserva__estado-texto");
      estadoTexto.textContent = "Completada";

      izquierda.appendChild(estadoTexto);
      centro.appendChild(btnFactura);
      centro.style.justifyContent = "center"; // Centrar botón factura
    } 
    else if (estado === "cancelada") {
      // 👉 Si está cancelada, deshabilitar botón de detalles
      const btnDetalles = document.createElement("button");
      btnDetalles.classList.add("reserva__boton");
      btnDetalles.textContent = "Detalles";
      btnDetalles.disabled = true;

      // Texto de estado
      const estadoTexto = document.createElement("p");
      estadoTexto.classList.add("reserva__estado-cancelado");
      estadoTexto.textContent = "Cancelada";

      izquierda.appendChild(estadoTexto);
      centro.appendChild(btnDetalles);
    } 
    else if (estado === "pendiente") {
      // 👉 Si está pendiente, permitir detalles, edición y eliminación
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
            // Cambiar estado de la cita a "cancelada"
            const objeto = { id_estado_cita: 3 }; 
            try {
              const res = await put(`citas/${cita.id_cita}/estado`, objeto);

              // Actualizar visualmente el estado en la UI
              const elemento = document.querySelector(`[data-id='${cita.id_cita}']`);
              if (elemento) {
                const izquierda = elemento.querySelector(".reserva__estado");
                izquierda.innerHTML = "";
                const estadoTexto = document.createElement("p");
                estadoTexto.classList.add("reserva__estado-cancelado");
                estadoTexto.textContent = "Cancelada";
                izquierda.appendChild(estadoTexto);

                // Deshabilitar botón de detalles
                const btnDetallesEnUI = elemento.querySelector(".reserva__acciones .reserva__boton");
                if (btnDetallesEnUI) {
                  btnDetallesEnUI.disabled = true;
                  btnDetallesEnUI.classList.add("boton--deshabilitado");
                }
              }
            } catch (error) {
              console.error(error);
              alertaError(error.message || "No fue posible actualizar la cita");
            }
          }
        );
      });

      centro.appendChild(btnDetalles);
      izquierda.append(btnEditar, btnEliminar);
    }

    // Ensamblar reserva en el contenedor
    item.append(derecha, centro, izquierda);
    contenedorPrincipal.appendChild(item);
  }

  // Si el usuario no tiene citas, mostrar mensaje informativo
  if (!tieneCitas) {
    alertaInfo(
      "¡Sin reservas!",
      "Aún no has agendado una cita. ¡Te esperamos para reservar tu próxima experiencia!"
    );
  }

  // Insertar todo en el DOM
  main.appendChild(contenedorPrincipal);
};

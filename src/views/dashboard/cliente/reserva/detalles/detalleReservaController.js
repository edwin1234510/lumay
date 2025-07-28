import { alertaError, alertaExito, confirmarAccion } from "../../../../../componentes/sweetAlert.js";
import { del, get } from "../../../../../utils/api.js";
import { traerPerfo, traerMate } from "../../../../../validaciones/validacion.js";

export const detalleReservaController = async (id_cita) => {
  const citaDetalles = await get("citas/detalle");
  const tbody = document.querySelector(".tabla__cuerpo");
  tbody.innerHTML = "";

  // Filtrar los detalles que pertenecen a esta cita
  const detallesCita = citaDetalles.filter(d => d.id_cita == id_cita);

  for (const detalles of detallesCita) {
    const fila = document.createElement("tr");
    fila.classList.add("fila");

    const piercing = document.createElement("td");
    const material = document.createElement("td");
    const precio = document.createElement("td");
    const editar = document.createElement("td");
    const eliminar = document.createElement("td");

    const botonEditar = document.createElement("button");
    const botonEliminar = document.createElement("button");

    piercing.classList.add("celda");
    material.classList.add("celda");
    precio.classList.add("celda");
    editar.classList.add("celda");
    eliminar.classList.add("celda");
    botonEditar.classList.add("celda__boton");
    botonEliminar.classList.add("celda__boton");

    botonEditar.textContent = "Editar";
    botonEliminar.textContent = "Eliminar";

    const perforacion = await traerPerfo(detalles.id_piercing);
    const materiales = await traerMate(detalles.id_material);

    piercing.textContent = perforacion.nombre_piercing;
    material.textContent = materiales.tipo_material;
    precio.textContent = perforacion.precio_piercing + materiales.precio_material;

    editar.append(botonEditar);
    eliminar.append(botonEliminar);
    fila.append(piercing, material, precio, editar, eliminar);
    tbody.append(fila);

    botonEditar.setAttribute("id", detalles.id_detalle);
    botonEliminar.setAttribute("id", detalles.id_detalle);

    botonEditar.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `#cliente/editar/${e.target.getAttribute("id")}`;
    });

    botonEliminar.addEventListener("click", (e) => {
      e.preventDefault();

      // ⚠️ Validación: no permitir eliminar si solo queda un detalle
      if (detallesCita.length <= 1) {
        alertaError("No puedes eliminar esta perforación porque la cita quedaría vacía.");
        return;
      }

      const idDetalle = e.target.getAttribute("id");
      const fila = e.target.closest("tr");

      confirmarAccion(
        "Espera",
        "¿Estás seguro de que deseas eliminar esta perforación?",
        async () => {
          try {
            const response = await del("citas/detalle/" + idDetalle);
            if (response.ok) {
              fila.remove();
              alertaExito("Perforación eliminada correctamente");
            } else {
              alertaError("No se pudo eliminar la perforación.");
            }
          } catch (error) {
            console.error("Error al eliminar:", error);
            alertaError("Ocurrió un error al eliminar la perforación.");
          }
        }
      );
    });
  }
};

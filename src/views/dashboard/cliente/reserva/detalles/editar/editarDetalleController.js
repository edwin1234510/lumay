import { alertaError, alertaExito } from "../../../../../../componentes/sweetAlert";
import { get, put } from "../../../../../../utils/api";

/**
 * Controlador para la edición de un detalle dentro de una cita (reserva).
 *
 * @async
 * @function editarDetalleController
 * @param {number} idDetalle - ID del detalle de la cita que se desea editar.
 * @returns {Promise<void>} - No retorna un valor directo, pero:
 *                            - Carga la información del detalle actual.
 *                            - Permite editar el piercing y material asociado.
 *                            - Calcula y muestra el precio actualizado.
 *                            - Guarda los cambios en la API.
 *
 * Flujo de la función:
 * 1. Obtiene el detalle actual por su ID.
 * 2. Carga los piercings y materiales disponibles (solo activos).
 * 3. Llenar dinámicamente los selects con opciones válidas.
 * 4. Calcula el precio según la combinación seleccionada.
 * 5. Permite regresar a la vista anterior sin recargar.
 * 6. Permite actualizar el detalle mediante un `PUT`.
 */
export const editarDetalleController = async (idDetalle) => {
  // Selección de elementos del DOM necesarios para la edición
  const selectPiercing = document.getElementById("select-piercing");
  const selectMaterial = document.getElementById("select-material");
  const inputPrecio = document.getElementById("precio");
  const botonRegresar = document.getElementById("btn-regresar");
  const formEditar = document.getElementById("formEditar");

  // Variable para guardar el detalle actual que se está editando
  let detalleActual = null;

  try {
    //  Obtener todos los detalles de la API y buscar el que corresponde al ID recibido
    const detalles = await get("citas/detalle");
    detalleActual = detalles.find(d => d.id_detalle == idDetalle);

    // Validar si existe el detalle, si no, mostrar error y salir
    if (!detalleActual) {
      alertaError("No se encontró el detalle");
      return;
    }

    // Obtener piercings y materiales disponibles desde la API
    const piercings = await get("piercings");
    const materiales = await get("materiales");

    //  Filtrar solo los piercings y materiales que estén activos
    const piercingsActivos = piercings.filter(p => p.id_estado_piercing === 1);
    const materialesActivos = materiales.filter(m => m.id_estado_material === 1);

    //  Llenar el select de piercings con opciones dinámicas
    piercingsActivos.forEach(p => {
      const opcion = document.createElement("option");
      opcion.value = p.id_piercing;                     // ID del piercing
      opcion.textContent = p.nombre_piercing;           // Nombre visible
      opcion.dataset.precio = p.precio_piercing;        // Guardar el precio en dataset

      // Seleccionar la opción si coincide con el detalle actual
      if (p.id_piercing == detalleActual.id_piercing) {
        opcion.selected = true;
      }
      selectPiercing.appendChild(opcion);
    });

    //  Llenar el select de materiales con opciones dinámicas
    materialesActivos.forEach(m => {
      const opcion = document.createElement("option");
      opcion.value = m.id_material;                    // ID del material
      opcion.textContent = m.tipo_material;            // Nombre visible
      opcion.dataset.precio = m.precio_material;       // Guardar el precio en dataset

      // Seleccionar la opción si coincide con el detalle actual
      if (m.id_material == detalleActual.id_material) {
        opcion.selected = true;
      }
      selectMaterial.appendChild(opcion);
    });

    //  Mostrar el precio inicial según los valores seleccionados
    mostrarPrecio();

    //  Actualizar el precio automáticamente si el usuario cambia piercing o material
    selectPiercing.addEventListener("change", mostrarPrecio);
    selectMaterial.addEventListener("change", mostrarPrecio);

    /**
     * Calcula y muestra el precio total en base al piercing + material seleccionado.
     * @returns {void}
     */
    function mostrarPrecio() {
      const precioPiercing = parseFloat(selectPiercing.selectedOptions[0]?.dataset.precio || 0);
      const precioMaterial = parseFloat(selectMaterial.selectedOptions[0]?.dataset.precio || 0);
      const total = precioPiercing + precioMaterial;

      // Mostrar el precio total en el input, formateado en pesos
      inputPrecio.value = `$ ${total.toFixed(0)}`;
    }

    /**
     * Evento para regresar a la vista de detalles de la cita
     * sin necesidad de recargar la página.
     */
    botonRegresar.addEventListener("click", (e) => {
      e.preventDefault();
      if (detalleActual) {
        // Redirigir al listado de detalles de la cita actual
        location.hash = `#cliente/detalles/${detalleActual.id_cita}`;
      }
    });

    /**
     * Evento para manejar el envío del formulario de edición de detalle.
     * Valida la información y actualiza el detalle mediante la API.
     */
    formEditar.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validación: asegurarse de que se seleccionó un piercing y un material
      if (!selectPiercing.value || !selectMaterial.value) {
        alertaError("Debes seleccionar un piercing y un material");
        return;
      }

      // Construcción del objeto con los nuevos datos
      const datos = {
        id_piercing: parseInt(selectPiercing.value),
        id_material: parseInt(selectMaterial.value)
      };

      try {
        //  Enviar actualización a la API
        const respuesta = await put(`citas/detalle/${idDetalle}`, datos);
        alertaExito("Detalle actualizado con éxito.");
      } catch (error) {
        console.error(error);
        alertaError(error.message || "No fue posible actualizar el detalle");
      }
    });

  } catch (error) {
    // Manejo de errores al cargar los datos iniciales
    alertaError("Error cargando datos");
    console.error(error);
  }
};

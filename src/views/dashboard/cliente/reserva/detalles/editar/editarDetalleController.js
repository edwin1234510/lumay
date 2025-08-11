import { alertaError, alertaExito } from "../../../../../../componentes/sweetAlert";
import { get, put } from "../../../../../../utils/api";

export const editarDetalleController = async (idDetalle) => {
  const selectPiercing = document.getElementById("select-piercing");
  const selectMaterial = document.getElementById("select-material");
  const inputPrecio = document.getElementById("precio");
  const botonRegresar = document.getElementById("btn-regresar");
  const formEditar = document.getElementById("formEditar");

  let detalleActual = null;

  try {
    // Obtener todos los detalles y encontrar el que vamos a editar
    const detalles = await get("citas/detalle");
    detalleActual = detalles.find(d => d.id_detalle == idDetalle);

    if (!detalleActual) {
      alertaError("No se encontró el detalle");
      return;
    }

    // Obtener piercings y materiales
    const piercings = await get("piercings");
    const materiales = await get("materiales");

    // Filtrar solo activos
    const piercingsActivos = piercings.filter(p => p.id_estado_piercing === 1);
    const materialesActivos = materiales.filter(m => m.id_estado_material === 1);

    // Llenar select piercings
    piercingsActivos.forEach(p => {
      const opcion = document.createElement("option");
      opcion.value = p.id_piercing;
      opcion.textContent = p.nombre_piercing;
      opcion.dataset.precio = p.precio_piercing;
      if (p.id_piercing == detalleActual.id_piercing) {
        opcion.selected = true;
      }
      selectPiercing.appendChild(opcion);
    });

    // Llenar select materiales
    materialesActivos.forEach(m => {
      const opcion = document.createElement("option");
      opcion.value = m.id_material;
      opcion.textContent = m.tipo_material;
      opcion.dataset.precio = m.precio_material;
      if (m.id_material == detalleActual.id_material) {
        opcion.selected = true;
      }
      selectMaterial.appendChild(opcion);
    });

    // Mostrar precio inicial
    mostrarPrecio();

    selectPiercing.addEventListener("change", mostrarPrecio);
    selectMaterial.addEventListener("change", mostrarPrecio);

    function mostrarPrecio() {
      const precioPiercing = parseFloat(selectPiercing.selectedOptions[0]?.dataset.precio || 0);
      const precioMaterial = parseFloat(selectMaterial.selectedOptions[0]?.dataset.precio || 0);
      const total = precioPiercing + precioMaterial;
      inputPrecio.value = `$ ${total.toFixed(0)}`;
    }

    botonRegresar.addEventListener("click", (e) => {
      e.preventDefault();
      if (detalleActual) {
        location.hash = `#cliente/detalles/${detalleActual.id_cita}`;
      }
    });

    formEditar.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!selectPiercing.value || !selectMaterial.value) {
        alertaError("Debes seleccionar un piercing y un material");
        return;
      }

      const datos = {
        id_piercing: parseInt(selectPiercing.value),
        id_material: parseInt(selectMaterial.value)
      };

      try {
        const respuesta = await put(`citas/detalle/${idDetalle}`, datos);
        if (respuesta.ok) {
          alertaExito("Detalle actualizado con éxito.");
        } else {
          const texto = await respuesta.text();
          alertaError("Error al actualizar: " + texto);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alertaError("No se pudo conectar al servidor.");
      }
    });

  } catch (error) {
    alertaError("Error cargando datos");
    console.error(error);
  }
};

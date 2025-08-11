import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert.js";
import { get, post } from "../../../../../utils/api.js";

export const seleccionPerforacionController = async () => {
  const btnAgregar = document.querySelector(".contenedor_main__icono");
  const btnGuardar = document.getElementById("btnGuardar");
  const contenedorMain = document.querySelector(".main-container");

  let piercings = [];
  let materiales = [];

  // Cargar piercings y materiales
  async function cargarDatos() {
    try {
      piercings = await get("piercings");
      materiales = await get("materiales");

      document.querySelectorAll(".contenido_agendar").forEach(cargarCombos);
    } catch (err) {
      console.error("Error al cargar datos desde el servidor:", err);
    }
  }

  // Cargar selects en un bloque
  function cargarCombos(contenedor) {
    const selectPiercing = contenedor.querySelector("#select-piercing");
    const selectMaterial = contenedor.querySelector("#select-material");
    const precioP = contenedor.querySelector(".precios p");

    if (!selectPiercing || !selectMaterial || !precioP) return;

    const piercingsActivos = piercings.filter(p => p.id_estado_piercing === 1);
    const materialesActivos = materiales.filter(m => m.id_estado_material === 1);

    selectPiercing.innerHTML = '<option value="">Piercing</option>';
    piercingsActivos.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id_piercing;
      option.textContent = p.nombre_piercing;
      option.dataset.precio = p.precio_piercing;
      selectPiercing.appendChild(option);
    });

    selectMaterial.innerHTML = '<option value="">Material</option>';
    materialesActivos.forEach(m => {
      const option = document.createElement("option");
      option.value = m.id_material;
      option.textContent = m.tipo_material;
      option.dataset.precio = m.precio_material;
      selectMaterial.appendChild(option);
    });

    // Eventos para actualizar precio
    selectPiercing.addEventListener("change", () =>
      actualizarPrecio(precioP, selectPiercing, selectMaterial)
    );
    selectMaterial.addEventListener("change", () =>
      actualizarPrecio(precioP, selectPiercing, selectMaterial)
    );

    // Evento para eliminar bloque
    const linkEliminar = contenedor.querySelector(".eliminar__link");
    linkEliminar.addEventListener("click", e => {
      e.preventDefault();
      const bloques = document.querySelectorAll(".contenido_agendar");
      if (bloques.length > 1) {
        contenedor.remove();
      } else {
        alertaError("Debes tener al menos una perforación.");
      }
    });
  }

  // Calcular precio combinado
  function actualizarPrecio(label, selectP, selectM) {
    const precioP = parseFloat(selectP.selectedOptions[0]?.dataset.precio || 0);
    const precioM = parseFloat(selectM.selectedOptions[0]?.dataset.precio || 0);
    label.textContent = `$ ${precioP + precioM}`;
  }

  // Agregar nueva perforación
  btnAgregar.addEventListener("click", () => {
    const original = document.querySelector(".contenido_agendar");
    if (!original) return;

    const clon = original.cloneNode(true);

    // Resetear valores
    clon.querySelector("#select-piercing").value = "";
    clon.querySelector("#select-material").value = "";
    clon.querySelector(".precios p").textContent = "$ 0";

    // Insertar nuevo bloque antes del botón
    contenedorMain.insertBefore(clon, btnAgregar);
    cargarCombos(clon); // Reasignar eventos al clon
  });

  // Guardar cita con múltiples detalles
  btnGuardar.addEventListener("click", async () => {
    const cita = JSON.parse(localStorage.getItem("cita_parcial"));
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!cita || !usuario) {
      alertaError("Error: falta información de usuario o cita parcial");
      return;
    }

    const detalles = [];
    let valido = true;

    document.querySelectorAll(".contenido_agendar").forEach(bloque => {
      const id_piercing = parseInt(bloque.querySelector("#select-piercing").value);
      const id_material = parseInt(bloque.querySelector("#select-material").value);

      if (!id_piercing || !id_material) {
        valido = false;
      } else {
        detalles.push({
          id_piercing,
          id_material,
          duracion_minutos: 15,
        });
      }
    });

    if (!valido || detalles.length === 0) {
      alertaError("Debes seleccionar un piercing y material en todos los campos.");
      return;
    }

    const datos = { cita, detalles };

    try {
      const response = await post("citas", datos);
      if (response.ok) {
        alertaExito("Cita agendada correctamente");
        localStorage.removeItem("cita_parcial");
        location.hash = "#cliente/reserva";
      } else {
        const error = await response.text();
        alertaError("El tiempo requerido para la última perforación se sobrepone con otra cita existente.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alertaError("No se pudo conectar al servidor.");
    }
  });

  await cargarDatos();
};

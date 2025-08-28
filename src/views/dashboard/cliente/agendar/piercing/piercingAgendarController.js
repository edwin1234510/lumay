import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert.js"; 
import { get, post } from "../../../../../utils/api.js";

/**
 * Controlador para gestionar la selección de perforaciones al agendar una cita.
 * 
 * - Carga los piercings y materiales desde el servidor.
 * - Permite al cliente seleccionar múltiples combinaciones de piercing + material.
 * - Calcula y muestra los precios en tiempo real.
 * - Valida que cada bloque tenga seleccionados ambos campos.
 * - Guarda la cita junto con los detalles seleccionados en el backend.
 * 
 * @returns {Promise<void>} No retorna directamente un valor,
 *                          pero actualiza el DOM, manipula el localStorage
 *                          y guarda la cita en la API si todo es correcto.
 */
export const seleccionPerforacionController = async () => {
  //  Elementos principales del DOM
  const btnAgregar = document.querySelector(".contenedor_main__icono");
  const btnGuardar = document.getElementById("btnGuardar");
  const contenedorMain = document.querySelector(".main-container");

  //  Variables para almacenar datos de backend
  let piercings = [];
  let materiales = [];

  /**
   * Carga piercings y materiales desde la API y los inyecta en los "combos".
   * 
   * @returns {Promise<void>}
   */
  async function cargarDatos() {
    try {
      piercings = await get("piercings");     // Piercings disponibles
      materiales = await get("materiales");  // Materiales disponibles

      // Inicializa los combos en todos los bloques de perforación existentes
      document.querySelectorAll(".contenido_agendar").forEach(cargarCombos);
    } catch (err) {
      console.error("Error al cargar datos desde el servidor:", err);
    }
  }

  /**
   * Inserta opciones de piercing y material dentro de un bloque de selección.
   * 
   * @param {HTMLElement} contenedor - Bloque que contiene los selectores de piercing/material.
   */
  function cargarCombos(contenedor) {
    const selectPiercing = contenedor.querySelector("#select-piercing");
    const selectMaterial = contenedor.querySelector("#select-material");
    const precioP = contenedor.querySelector(".precios p");

    // Si faltan elementos esenciales, no se hace nada
    if (!selectPiercing || !selectMaterial || !precioP) return;

    // Filtrar solo activos
    const piercingsActivos = piercings.filter(p => p.id_estado_piercing === 1);
    const materialesActivos = materiales.filter(m => m.id_estado_material === 1);

    // Llenar select de piercings
    selectPiercing.innerHTML = '<option value="">Piercing</option>';
    piercingsActivos.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id_piercing;
      option.textContent = p.nombre_piercing;
      option.dataset.precio = p.precio_piercing;
      selectPiercing.appendChild(option);
    });

    // Llenar select de materiales
    selectMaterial.innerHTML = '<option value="">Material</option>';
    materialesActivos.forEach(m => {
      const option = document.createElement("option");
      option.value = m.id_material;
      option.textContent = m.tipo_material;
      option.dataset.precio = m.precio_material;
      selectMaterial.appendChild(option);
    });

    //  Eventos para actualizar el precio combinado en tiempo real
    selectPiercing.addEventListener("change", () =>
      actualizarPrecio(precioP, selectPiercing, selectMaterial)
    );
    selectMaterial.addEventListener("change", () =>
      actualizarPrecio(precioP, selectPiercing, selectMaterial)
    );

    //  Evento para eliminar el bloque de perforación
    const linkEliminar = contenedor.querySelector(".eliminar__link");
    linkEliminar.addEventListener("click", e => {
      e.preventDefault();
      const bloques = document.querySelectorAll(".contenido_agendar");
      if (bloques.length > 1) {
        contenedor.remove(); // Elimina el bloque actual
      } else {
        alertaError("Debes tener al menos una perforación.");
      }
    });
  }

  /**
   * Calcula y actualiza el precio total de la combinación piercing + material.
   * 
   * @param {HTMLElement} label - Elemento donde se muestra el precio.
   * @param {HTMLSelectElement} selectP - Selector de piercing.
   * @param {HTMLSelectElement} selectM - Selector de material.
   */
  function actualizarPrecio(label, selectP, selectM) {
    const precioP = parseFloat(selectP.selectedOptions[0]?.dataset.precio || 0);
    const precioM = parseFloat(selectM.selectedOptions[0]?.dataset.precio || 0);
    label.textContent = `$ ${precioP + precioM}`;
  }

  //  Evento: agregar una nueva perforación (clonar bloque)
  btnAgregar.addEventListener("click", () => {
    const original = document.querySelector(".contenido_agendar");
    if (!original) return;

    // Se clona el bloque de perforación
    const clon = original.cloneNode(true);

    // Resetear valores iniciales
    clon.querySelector("#select-piercing").value = "";
    clon.querySelector("#select-material").value = "";
    clon.querySelector(".precios p").textContent = "$ 0";

    // Insertar el clon antes del botón de agregar
    contenedorMain.insertBefore(clon, btnAgregar);
    cargarCombos(clon); // Reasignar eventos al clon
  });

  //  Evento: guardar la cita con todos los detalles seleccionados
  btnGuardar.addEventListener("click", async () => {
    const cita = JSON.parse(localStorage.getItem("cita_parcial"));
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Validación: debe existir la cita parcial y el usuario en sesión
    if (!cita || !usuario) {
      alertaError("Error: falta información de usuario o cita parcial");
      return;
    }

    const detalles = [];
    let valido = true;

    // Recorre cada bloque de perforación para recolectar datos
    document.querySelectorAll(".contenido_agendar").forEach(bloque => {
      const id_piercing = parseInt(bloque.querySelector("#select-piercing").value);
      const id_material = parseInt(bloque.querySelector("#select-material").value);

      if (!id_piercing || !id_material) {
        valido = false; // Si falta algún dato, se marca inválido
      } else {
        detalles.push({
          id_piercing,
          id_material,
          duracion_minutos: 15, // Duración fija por perforación
        });
      }
    });

    // Si hay campos vacíos, se detiene el flujo
    if (!valido || detalles.length === 0) {
      alertaError("Debes seleccionar un piercing y material en todos los campos.");
      return;
    }

    // Construir payload para enviar al backend
    const datos = { cita, detalles };

    try {
      const response = await post("citas", datos);

      if (response.ok) {
        // Si se guarda correctamente, limpiar estado y redirigir
        alertaExito("Cita agendada correctamente");
        localStorage.removeItem("cita_parcial");
        location.hash = "#cliente/reserva";
      } else {
        // Si hay conflicto de horario, mostrar error
        const error = await response.text();
        alertaError("El tiempo requerido para la última perforación se sobrepone con otra cita existente.");
      }
    } catch (error) {
      // Manejo de errores de red
      console.error("Error de red:", error);
      alertaError("No se pudo conectar al servidor.");
    }
  });

  //  Inicialización: carga de datos al iniciar el controlador
  await cargarDatos();
};

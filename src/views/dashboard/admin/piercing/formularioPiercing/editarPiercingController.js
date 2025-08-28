import { get, put } from "../../../../../utils/api"; 
import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";

/**
 * Controlador para la edición de piercings.
 *
 * - Carga la información del piercing a editar en un formulario.
 * - Llena dinámicamente las zonas disponibles y los estados posibles.
 * - Permite actualizar el nombre, precio, zona y estado del piercing.
 *
 * @async
 * @function editarPiercingController
 * @param {number} id - El identificador único del piercing a editar.
 * @returns {Promise<void>} No retorna un valor directo.
 *   Sus efectos son:
 *   - Rellenar el formulario con los datos del piercing existente.
 *   - Enviar una solicitud PUT a la API para actualizar los datos.
 *   - Mostrar alertas de éxito o error según corresponda.
 */
export const editarPiercingController = async (id) => {
  // 🔹 Referencias a los elementos del formulario en el DOM
  const form = document.querySelector("#formPerfo"); // Formulario principal
  const inputNombre = document.querySelector("#piercing"); // Input para el nombre del piercing
  const inputPrecio = document.querySelector("#precio"); // Input para el precio
  const selectZona = document.querySelector("#zona"); // Select para las zonas disponibles

  // 🔹 Crear dinámicamente el combo box (select) para elegir el estado del piercing
  const labelEstado = document.createElement("label"); // Crear etiqueta <label> asociada al select
  labelEstado.classList.add("formulario__label"); // Asignar clase para estilos
  labelEstado.setAttribute("for", "estado"); // Relacionar el label con el select
  labelEstado.textContent = "Estado del piercing"; // Texto visible

  const selectEstado = document.createElement("select"); // Crear el <select> para estados
  selectEstado.classList.add("formulario__input"); // Asignar estilos
  selectEstado.id = "estado"; // ID único para relacionarlo en el formulario

  // Insertamos el label y el select dinámicamente antes del botón de "Siguiente"
  const btnSiguiente = document.querySelector("#btnSiguiente");
  form.insertBefore(labelEstado, btnSiguiente);
  form.insertBefore(selectEstado, btnSiguiente);

  // 🔹 Si no se recibe un id, significa que no estamos editando nada y la función termina
  if (!id) return;

  // 🔹 Obtener las zonas desde la API
  const zonas = await get("zonas");
  zonas
    .filter(z => z.id_estado_zona === 1) // Filtrar únicamente las zonas activas
    .forEach(z => {
      // Crear <option> por cada zona activa
      const option = document.createElement("option");
      option.value = z.id_zona; // El valor será el id de la zona
      option.textContent = z.nombre_zona; // El texto visible será el nombre de la zona
      selectZona.appendChild(option); // Agregar la opción al select de zonas
    });

  // 🔹 Obtener los estados posibles del piercing desde la API
  const estados = await get("estados_piercings");
  estados.forEach(e => {
    // Crear <option> por cada estado
    const option = document.createElement("option");
    option.value = e.id_estado_piercing; // El valor será el id del estado
    option.textContent = e.nombre_estado; // El texto visible será el nombre del estado
    selectEstado.appendChild(option); // Agregar la opción al select de estados
  });

  // 🔹 Buscar el piercing en la API por su id
  const piercings = await get("piercings"); // Obtener todos los piercings
  const piercing = piercings.find(p => p.id_piercing == id); // Buscar el piercing que coincida con el id recibido

  if (!piercing) {
    // Si no se encuentra el piercing, mostramos error y detenemos el flujo
    alertaError("No se encontró el piercing");
    return;
  }

  // 🔹 Rellenar el formulario con los datos actuales del piercing
  inputNombre.value = piercing.nombre_piercing; // Nombre actual del piercing
  inputPrecio.value = piercing.precio_piercing; // Precio actual
  selectZona.value = piercing.id_zona; // Zona actual
  selectEstado.value = piercing.id_estado_piercing; // Estado actual

  // 🔹 Manejar el evento de envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar que la página se recargue

    // Obtener y limpiar los valores ingresados por el usuario
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value.trim()); // Convertir a número
    const idZona = parseInt(selectZona.value); // Convertir a número
    const idEstado = parseInt(selectEstado.value); // Convertir a número

    // Validar que todos los campos estén completos y con valores válidos
    if (!nombre || isNaN(precio) || isNaN(idZona) || isNaN(idEstado)) {
      alertaError("Por favor completa todos los campos correctamente.");
      return;
    }

    // Construir objeto con los nuevos valores del piercing
    const nuevoPiercing = {
      nombre_piercing: nombre,
      precio_piercing: precio,
      id_zona: idZona,
      id_estado_piercing: idEstado
    };

    // 🔹 Enviar la actualización a la API mediante un PUT
    try {
      await put(`piercings/${id}`, nuevoPiercing); // Actualizamos el piercing en el backend
      alertaExito("Piercing actualizado correctamente"); // Mensaje de éxito
    } catch (error) {
      console.error("Error al actualizar:", error); // Log para depuración
      alertaError("Error al actualizar el piercing"); // Mensaje de error para el usuario
    }
  });
};

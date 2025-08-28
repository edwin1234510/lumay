import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert"; 
import { get, post } from "../../../../../utils/api";
import { soloLetras, soloNumeros } from "../../../../../validaciones/validacion";

/**
 * Controlador para el registro de piercings.
 *
 * - Valida los campos del formulario (solo letras en nombre, solo números en precio).
 * - Carga dinámicamente las zonas activas desde la API.
 * - Verifica que el piercing no exista previamente.
 * - Envía la información del nuevo piercing a la API.
 *
 * @async
 * @function piercingController
 * @returns {Promise<void>} No retorna un valor directo.
 *   Sus efectos son:
 *   - Insertar opciones de zonas en el <select>.
 *   - Mostrar alertas de éxito o error según corresponda.
 *   - Registrar un nuevo piercing en la API si los datos son válidos.
 */
export const piercingController = async () => {
  //  Selección de elementos del formulario
  const form = document.querySelector("#formPerfo");
  const inputNombre = document.querySelector("#piercing");
  const inputPrecio = document.querySelector("#precio");
  const selectZona = document.querySelector("#zona");

  //  Validaciones de entradas
  inputPrecio.addEventListener("keydown", soloNumeros); // Solo permite números en precio
  inputNombre.addEventListener("keydown", soloLetras);  // Solo permite letras en nombre

  //  Cargar las zonas activas desde la API para llenar el select
  try {
    const zonas = await get("zonas");

    zonas
      .filter(z => z.id_estado_zona === 1) // Solo incluir zonas activas
      .forEach(z => {
        const option = document.createElement("option");
        option.value = z.id_zona;           // ID de la zona
        option.textContent = z.nombre_zona; // Nombre visible de la zona
        selectZona.appendChild(option);
      });
  } catch (error) {
    // Manejo de errores al cargar las zonas
    console.error("Error al cargar zonas:", error);
  }

  //  Evento de envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar recarga de página

    //  Obtener valores de los campos
    const nombre = inputNombre.value.trim();
    const precioStr = inputPrecio.value.trim();
    const idZona = parseInt(selectZona.value);

    //  Validar campos vacíos
    if (!nombre || !precioStr) {
      alertaError("Todos los campos son obligatorios");
      return;
    }

    //  Validar precio mayor que 0
    const precio = parseFloat(precioStr);
    if (precio <= 0) {
      alertaError("El precio debe ser mayor a 0.");
      return;
    }

    //  Verificar si el piercing ya existe en la base de datos
    const repetidos = await get("piercings");
    const existentes = repetidos.some(
      p => p.nombre_piercing.toLowerCase() == nombre.toLowerCase()
    );
    if (existentes) {
      return alertaError("El piercing ya existe");
    }

    //  Crear objeto con los datos del nuevo piercing
    const nuevoPiercing = {
      nombre_piercing: nombre,
      precio_piercing: precio,
      id_zona: idZona,
      id_estado_piercing: 1 // Estado activo por defecto
    };

    //  Enviar datos a la API
    try {
      await post("piercings", nuevoPiercing);
      alertaExito("Piercing registrado correctamente");
    } catch (error) {
      console.error(error);
      alertaError(error.message || "Error al registrar el piercing");
    }
  });
};

import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert"; 
import { get, post } from "../../../../../utils/api";
import { soloLetras, soloNumeros } from "../../../../../validaciones/validacion";

/**
 * Controlador para la creación de materiales.
 * 
 * Este controlador:
 * - Obtiene referencias al formulario y sus inputs.
 * - Aplica validaciones de entrada (solo letras y solo números).
 * - Maneja el envío del formulario para crear un nuevo material en la base de datos.
 * - Valida campos vacíos, precio válido y materiales duplicados.
 * - Realiza la petición POST al backend y muestra alertas de éxito o error.
 * 
 * @returns {void} No retorna ningún valor directamente. 
 *                 Se encarga de registrar el material en el sistema y mostrar feedback al usuario.
 */
export const crearMaterialController = async () => {
    // Referencia al formulario y a los inputs
    const form = document.querySelector("#formMaterial");
    const inputMaterial = document.querySelector("#material");
    const inputPrecio = document.querySelector("#precio");

    // Validación: solo se permiten números en el input de precio
    inputPrecio.addEventListener("keydown", soloNumeros);

    // Validación: solo se permiten letras en el input de material
    inputMaterial.addEventListener("keydown", soloLetras);

    // Evento submit del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        // Capturar valores de los inputs eliminando espacios innecesarios
        const material = inputMaterial.value.trim();
        const precioStr = inputPrecio.value.trim();

        // Validación: verificar campos vacíos
        if (!material || !precioStr) {
            alertaError("Todos los campos son obligatorios");
            return; // Se detiene la ejecución si falta algún campo
        }

        // Convertir el precio de string a número decimal
        const precio = parseFloat(precioStr);

        // Validación: el precio debe ser mayor a 0
        if (precio <= 0) {
            alertaError("El precio debe ser mayor a 0.");
            return;
        }

        // Verificar si el material ya existe en la base de datos
        const repetidos = await get("materiales"); // Consulta todos los materiales
        const existentes = repetidos.some(m => m.tipo_material.toLowerCase() === material.toLowerCase());
        if (existentes) {
            return alertaError("El material ya existe"); // Alerta y se detiene la ejecución
        }

        // Crear objeto con la información del material a registrar
        const objeto = {
            tipo_material: material,
            precio_material: precio,
            id_estado_material: 1 // Estado activo por defecto
        };

        try {
            // Enviar material al backend mediante POST
            const respuesta = await post("materiales", objeto);

            // Mostrar alerta de éxito
            alertaExito("Material registrado correctamente");
        } catch (error) {
            // En caso de error, se muestra en consola y en pantalla
            console.error(error);
            alertaError(error.message || "Error al crear el material");
        }
    });
}

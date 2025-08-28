import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert"; 
import { get, post } from "../../../../../utils/api";
import { soloLetras } from "../../../../../validaciones/validacion";

/**
 * Función asincrónica que gestiona la creación de nuevas zonas.
 * 
 * - Se encarga de validar el campo de entrada (no vacío y solo letras).
 * - Verifica si la zona ya existe en el sistema consultando la API.
 * - Envía la información a la API para registrar la nueva zona.
 * - Muestra mensajes de éxito o error según la respuesta.
 * 
 * @returns {void} No retorna nada directamente. Sus efectos son:
 *  - Mostrar alertas visuales al usuario.
 *  - Realizar una petición POST al backend para crear la zona.
 */
export const crearZona = async() =>{
    // Selecciona el campo de texto donde se escribe el nombre de la zona
    const inputZona = document.querySelector("#zona");

    // Selecciona el formulario de creación de zonas
    const form = document.querySelector("#formZona");

    // Valida que en el input solo se puedan escribir letras
    inputZona.addEventListener("keydown", soloLetras);

    // Captura el evento de envío del formulario
    form.addEventListener("submit", async(e)=>{
        e.preventDefault(); // Evita que la página se recargue por defecto

        // Obtiene el valor escrito en el input, quitando espacios en blanco
        const zona = inputZona.value.trim();

        // Validación: si está vacío, muestra alerta y detiene el flujo
        if (!zona) {
            alertaError("El campo no puede estar vacío");
            return;
        }

        // Consulta las zonas ya registradas en la API
        const repetidos = await get("zonas");

        // Verifica si ya existe una zona con el mismo nombre (ignora mayúsculas/minúsculas)
        const existentes = repetidos.some(z => z.nombre_zona.toLowerCase() == zona.toLowerCase());

        if (existentes) {
            // Si la zona ya existe, muestra alerta y no crea nada
            return alertaError("La zona ya existe");
        }

        // Crea el objeto que se enviará al backend
        const objeto = {
            nombre_zona: zona,
            id_estado_zona: 1  // Estado inicial (activo)
        }

        // Envía el objeto al backend mediante una petición POST
        const respuesta = await post("zonas", objeto);

        try {
            // Si la respuesta fue exitosa, muestra mensaje de confirmación
            if (respuesta.ok) {
                alertaExito("Se creó la zona correctamente");
            }
            // Si la API responde con error, muestra alerta de error
            else {
                alertaError("No fue posible crear la zona");
            }
        } catch (error) {
            // Captura cualquier error inesperado (ej: servidor caído)
            console.error(error);
            alertaError("Error de servidor");
        }
    });
}

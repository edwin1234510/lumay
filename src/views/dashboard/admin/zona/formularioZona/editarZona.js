import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert"; 
import { get, put } from "../../../../../utils/api"
import { soloLetras } from "../../../../../validaciones/validacion";

/**
 * Controlador para editar una zona específica.
 * 
 * Esta función:
 *  - Obtiene la lista de zonas y estados de la API.
 *  - Inserta dinámicamente en el formulario un campo <select> para cambiar el estado de la zona.
 *  - Rellena el formulario con los datos de la zona que se desea editar.
 *  - Valida que el nombre de la zona solo permita letras.
 *  - Maneja el envío del formulario para actualizar la zona mediante un request PUT.
 * 
 * @async
 * @function editarZona
 * @param {number} id_zona - Identificador único de la zona que se desea editar.
 * @returns {Promise<void>} No retorna valor. Su efecto es actualizar el DOM y enviar datos a la API.
 */
export const editarZona = async(id_zona) => {
    //  Obtener todas las zonas y los posibles estados desde la API
    const zonas = await get("zonas");
    const estados = await get("estados_zonas"); // Se traen los estados disponibles para asignarlos al <select>
    
    //  Capturar elementos del DOM relacionados con el formulario
    const input = document.querySelector("#zona"); // Input de nombre de zona
    const form = document.querySelector("#formZona"); // Formulario principal

    //  Crear dinámicamente un label y un select para elegir el estado de la zona
    const labelEstado = document.createElement("label");
    labelEstado.classList.add("formulario__label");
    labelEstado.setAttribute("for", "estado");
    labelEstado.textContent = "Estado de la zona";

    const selectEstado = document.createElement("select");
    selectEstado.classList.add("formulario__input");
    selectEstado.setAttribute("id", "estado");
    selectEstado.setAttribute("name", "estado");

    //  Insertar en el <select> todas las opciones de estados obtenidos desde la API
    estados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.id_estado_zona;
        option.textContent = estado.nombre_estado;
        selectEstado.appendChild(option);
    });

    //  Ubicar el nuevo label y select justo antes del botón Guardar
    const btnGuardar = document.querySelector("#btnSiguiente");
    form.insertBefore(labelEstado, btnGuardar);
    form.insertBefore(selectEstado, btnGuardar);

    //  Rellenar el formulario con la información de la zona a editar
    zonas.forEach(element => {
        if (element.id_zona == id_zona) {
            input.value = element.nombre_zona;               // Asignar nombre actual de la zona
            selectEstado.value = element.id_estado_zona;     // Seleccionar el estado actual
        }
    });

    //  Validar que el input solo acepte letras
    input.addEventListener("keydown", soloLetras);

    //  Evento para manejar el envío del formulario
    form.addEventListener("submit", async(e) => {
        e.preventDefault(); // Evitar recarga por defecto del formulario

        // Capturar valores de los campos
        const zona = input.value.trim();
        const estadoSeleccionado = parseInt(selectEstado.value);

        // Validar que el campo de zona no esté vacío
        if (!zona) {
            alertaError("El campo no puede estar vacío");
            return;
        }

        // Construir objeto a enviar en la petición PUT
        const objeto = {
            nombre_zona: zona,
            id_estado_zona: estadoSeleccionado
        };

        // Intentar actualizar la zona en el servidor
        try {
            const data = await put(`zonas/${id_zona}`, objeto); // Request PUT
            alertaExito("Se actualizó la zona correctamente"); // Mensaje de éxito
        } catch (error) {
            console.error(error);
            alertaError(error.message || "No fue posible actualizar la zona"); // Mostrar error
        }
    });
};

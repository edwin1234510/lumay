import { get, put } from "../../../../../utils/api"; 
import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";
import { soloLetras, soloNumeros } from "../../../../../validaciones/validacion";

/**
 * Controlador para la edición de materiales.
 *
 * - Carga la información de un material existente en un formulario.
 * - Permite modificar su tipo, precio y estado.
 * - Envía la actualización a la API mediante un `PUT`.
 *
 * @async
 * @function editarMaterialController
 * @param {number} id - El identificador único del material a editar.
 * @returns {Promise<void>} No retorna un valor directo.
 *   Sus efectos son:
 *   - Rellenar el formulario con la información del material a editar.
 *   - Crear dinámicamente un `select` con los estados disponibles.
 *   - Actualizar el material en la API al enviar el formulario.
 *   - Mostrar alertas de éxito o error según corresponda.
 */
export const editarMaterialController = async (id) => {
    // Referencia al formulario y sus inputs
    const form = document.querySelector("#formMaterial");
    const inputMaterial = document.querySelector("#material");
    const inputPrecio = document.querySelector("#precio");

    // Validaciones de entrada:
    // - Solo letras para el nombre del material.
    // - Solo números para el precio.
    inputPrecio.addEventListener("keydown", soloNumeros);
    inputMaterial.addEventListener("keydown", soloLetras);

    // Si no se pasa un id, no hay material a editar, detenemos la ejecución.
    if (!id) return;

    // Obtener todos los materiales desde la API
    const materiales = await get("materiales");
    // Buscar el material específico por su ID
    const material = materiales.find(m => m.id_material == id);

    // Si no existe el material, mostramos error y detenemos.
    if (!material) {
        alertaError("No se encontró el material");
        return;
    }

    // Rellenar el formulario con los datos del material encontrado
    inputMaterial.value = material.tipo_material;
    inputPrecio.value = material.precio_material;

    // Crear dinámicamente un label y un select para elegir el estado del material
    const labelEstado = document.createElement("label");
    labelEstado.classList.add("formulario__label");
    labelEstado.setAttribute("for", "estadoMaterial");
    labelEstado.textContent = "Estado del material";

    const selectEstado = document.createElement("select");
    selectEstado.classList.add("formulario__input");
    selectEstado.setAttribute("name", "estadoMaterial");
    selectEstado.setAttribute("id", "estadoMaterial");

    // Obtener los estados de material desde el backend
    const estados = await get("estados_materiales_joyas");
    estados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.id_estado_material;
        option.textContent = estado.nombre_estado;

        // Marcar como seleccionado el estado actual del material
        if (estado.id_estado_material === material.id_estado_material) {
            option.selected = true;
        }

        selectEstado.appendChild(option);
    });

    // Insertar el label y el select dinámicamente antes del botón "Guardar"
    const btnGuardar = document.querySelector("#btnSiguiente");
    form.insertBefore(labelEstado, btnGuardar);
    form.insertBefore(selectEstado, btnGuardar);


    //  Evento de envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evitar recargar la página

        // Obtener valores del formulario
        const tipoMaterial = inputMaterial.value.trim();
        const precio = parseFloat(inputPrecio.value.trim());
        const id_estado_material = parseInt(selectEstado.value);

        // Validación: todos los campos deben estar completos y correctos
        if (!tipoMaterial || isNaN(precio)) {
            alertaError("Por favor completa todos los campos correctamente.");
            return;
        }

        // Construir el objeto con los datos actualizados del material
        const objeto = {
            tipo_material: tipoMaterial,
            precio_material: precio,
            id_estado_material: id_estado_material
        };

        // Enviar actualización a la API con método PUT
        try {
            const respuesta = await put(`materiales/${id}`, objeto);
            alertaExito("Material actualizado correctamente");
        } catch (error) {
            console.error(error);
            alertaError(error.message || "Error al actualizar el material");
        }
    });
};

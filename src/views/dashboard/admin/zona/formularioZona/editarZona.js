import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";
import { get, put } from "../../../../../utils/api"
import { soloLetras } from "../../../../../validaciones/validacion";

export const editarZona = async(id_zona) => {
    const zonas = await get("zonas");
    const estados = await get("estados_zonas"); // Traer estados de la API
    
    const input = document.querySelector("#zona");
    const form = document.querySelector("#formZona");

    // Crear elementos para el estado
    const labelEstado = document.createElement("label");
    labelEstado.classList.add("formulario__label");
    labelEstado.setAttribute("for", "estado");
    labelEstado.textContent = "Estado de la zona";

    const selectEstado = document.createElement("select");
    selectEstado.classList.add("formulario__input");
    selectEstado.setAttribute("id", "estado");
    selectEstado.setAttribute("name", "estado");

    // Agregar opciones al select
    estados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.id_estado_zona;
        option.textContent = estado.nombre_estado;
        selectEstado.appendChild(option);
    });

    // Insertar label y select antes del botón Guardar
    const btnGuardar = document.querySelector("#btnSiguiente");
    form.insertBefore(labelEstado, btnGuardar);
    form.insertBefore(selectEstado, btnGuardar);

    // Llenar campos con la info de la zona a editar
    zonas.forEach(element => {
        if (element.id_zona == id_zona) {
            input.value = element.nombre_zona;
            selectEstado.value = element.id_estado_zona; // Seleccionar estado actual
        }
    });

    // Validación para solo letras
    input.addEventListener("keydown", soloLetras);

    // Evento de submit
    form.addEventListener("submit", async(e) => {
        e.preventDefault();
        const zona = input.value.trim();
        const estadoSeleccionado = parseInt(selectEstado.value);

        if (!zona) {
            alertaError("El campo no puede estar vacío");
            return;
        }

        const objeto = {
            nombre_zona: zona,
            id_estado_zona: estadoSeleccionado
        };

        try {
            const respuesta = await put(`zonas/${id_zona}`, objeto);
            if (respuesta.ok) {
                alertaExito("Se actualizó la zona correctamente");
            } else {
                alertaError("No fue posible actualizar la zona");
            }
        } catch (error) {
            console.error(error);
            alertaError("Error de servidor");
        }
    });
};

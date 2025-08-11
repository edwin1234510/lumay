import { get, put } from "../../../../../utils/api";
import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";
import { soloLetras, soloNumeros } from "../../../../../validaciones/validacion";

export const editarMaterialController = async (id) => {
    const form = document.querySelector("#formMaterial");
    const inputMaterial = document.querySelector("#material");
    const inputPrecio = document.querySelector("#precio");

    inputPrecio.addEventListener("keydown", soloNumeros);
    inputMaterial.addEventListener("keydown", soloLetras);

    if (!id) return;

    // Obtener material por ID
    const materiales = await get("materiales");
    const material = materiales.find(m => m.id_material == id);

    if (!material) {
        alertaError("No se encontró el material");
        return;
    }

    // Llenar formulario
    inputMaterial.value = material.tipo_material;
    inputPrecio.value = material.precio_material;

    // Crear label y select dinámicamente
    const labelEstado = document.createElement("label");
    labelEstado.classList.add("formulario__label");
    labelEstado.setAttribute("for", "estadoMaterial");
    labelEstado.textContent = "Estado del material";

    const selectEstado = document.createElement("select");
    selectEstado.classList.add("formulario__input");
    selectEstado.setAttribute("name", "estadoMaterial");
    selectEstado.setAttribute("id", "estadoMaterial");

    // Llenar el select con estados desde el backend
    const estados = await get("estados_materiales_joyas");
    estados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.id_estado_material;
        option.textContent = estado.nombre_estado;
        if (estado.id_estado_material === material.id_estado_material) {
            option.selected = true; // marcar el estado actual del material
        }
        selectEstado.appendChild(option);
    });

    // Insertar el label y select antes del botón
    const btnGuardar = document.querySelector("#btnSiguiente");
    form.insertBefore(labelEstado, btnGuardar);
    form.insertBefore(selectEstado, btnGuardar);

    // Manejar envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const tipoMaterial = inputMaterial.value.trim();
        const precio = parseFloat(inputPrecio.value.trim());
        const id_estado_material = parseInt(selectEstado.value);

        if (!tipoMaterial || isNaN(precio)) {
            alertaError("Por favor completa todos los campos correctamente.");
            return;
        }

        const objeto = {
            tipo_material: tipoMaterial,
            precio_material: precio,
            id_estado_material: id_estado_material
        };

        try {
            const respuesta = await put(`materiales/${id}`, objeto);
            if (respuesta.ok) {
                alertaExito("Material actualizado correctamente");
            } else {
                alertaError("Error al actualizar el material");
            }
        } catch (error) {
            console.error(error);
            alertaError("Error del servidor");
        }
    });
};

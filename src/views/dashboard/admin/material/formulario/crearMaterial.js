import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";
import { get, post } from "../../../../../utils/api";
import { soloLetras, soloNumeros } from "../../../../../validaciones/validacion";

export const crearMaterialController = async() =>{
    const form = document.querySelector("#formMaterial");
    const inputMaterial = document.querySelector("#material");
    const inputPrecio = document.querySelector("#precio");

    inputPrecio.addEventListener("keydown", soloNumeros);
    inputMaterial.addEventListener("keydown", soloLetras);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const material = inputMaterial.value.trim();
        const precioStr = inputPrecio.value.trim();

        if (!material || !precioStr) {
            alertaError("Todos los campos son obligatorios");
            return;
        }

        const precio = parseFloat(precioStr);
        if (precio <= 0) {
            alertaError("El precio debe ser mayor a 0.");
            return;
        }

        const repetidos = await get("materiales");
        const existentes = repetidos.some(m => m.tipo_material.toLowerCase() == material.toLowerCase());
        if (existentes) {
            return alertaError("El material ya existe");
        }

        const objeto = {
            tipo_material: material,
            precio_material: precio,
            id_estado_material: 1
        };
        const respuesta = await post("materiales", objeto);
        try {
            if (respuesta.ok) {
                alertaExito("Material registrado correctamente");
            }
            else{
                alertaError("Error al registrar el material");
            }
            
        } catch (error) {
            console.error(error);
            alertaError("Error en el servidor");
        }
    });
}
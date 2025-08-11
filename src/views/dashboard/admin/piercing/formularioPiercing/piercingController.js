import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";
import { get, post } from "../../../../../utils/api";
import { soloLetras, soloNumeros } from "../../../../../validaciones/validacion";

export const piercingController = async () => {
    const form = document.querySelector("#formPerfo");
    const inputNombre = document.querySelector("#piercing");
    const inputPrecio = document.querySelector("#precio");
    const selectZona = document.querySelector("#zona");

    inputPrecio.addEventListener("keydown", soloNumeros);
    inputNombre.addEventListener("keydown", soloLetras);

    try {
        const zonas = await get("zonas");
        zonas
            .filter(z => z.id_estado_zona === 1) 
            .forEach(z => {
                const option = document.createElement("option");
                option.value = z.id_zona;
                option.textContent = z.nombre_zona;
                selectZona.appendChild(option);
            });
    } catch (error) {
        console.error("Error al cargar zonas:", error);
    }

    

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        const precioStr = inputPrecio.value.trim();
        const idZona = parseInt(selectZona.value);

        if (!nombre || !precioStr) {
            alertaError("Todos los campos son obligatorios");
            return;
        }

        const precio = parseFloat(precioStr);
        if (precio <= 0) {
            alertaError("El precio debe ser mayor a 0.");
            return;
        }

        const nuevoPiercing = {
            nombre_piercing: nombre,
            precio_piercing: precio,
            id_zona: idZona,
            id_estado_piercing: 1
        };
        const respuesta = await post("piercings", nuevoPiercing);
        try {
            if (respuesta.ok) {
                alertaExito("Piercing registrado correctamente");
            }
            else{
                alertaError("Error al registrar el piercing");
            }
            
        } catch (error) {
            console.error("Error al registrar piercing:", error);
            alertaError("Error en el servidor");
        }
    });
};

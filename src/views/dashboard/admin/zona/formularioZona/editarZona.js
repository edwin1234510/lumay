import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";
import { get, put } from "../../../../../utils/api"
import { soloLetras } from "../../../../../validaciones/validacion";

export const editarZona = async(id_zona) =>{
    const zonas = await get("zonas");
    const input = document.querySelector("#zona")
    zonas.forEach(element => {
        if (element.id_zona == id_zona) {
            input.value = element.nombre_zona;
        }
    });

    const form = document.querySelector("#formZona");
    input.addEventListener("keydown", soloLetras);

    form.addEventListener("submit", async(e)=>{
        e.preventDefault();
        const zona = input.value.trim();
        if (!zona) {
            alertaError("El campo no puede estar vacio")
            return
        }
        const objeto = {
            nombre_zona: zona
        }
        const respuesta = await put(`zonas/${id_zona}`,objeto);
        try {
            if (respuesta.ok) {
                alertaExito("Se actualizo la zona correctamente")
            }
            else{
                alertaError("No fue posible actualizar la zona");
            }
        } catch (error) {
            console.error(error);
            alertaError("Error de servidor")
        }
    })

}
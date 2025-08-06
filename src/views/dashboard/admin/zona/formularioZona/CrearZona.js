import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";
import { post } from "../../../../../utils/api";
import { soloLetras } from "../../../../../validaciones/validacion";

export const crearZona = async() =>{
    const inputZona = document.querySelector("#zona");
    const form = document.querySelector("#formZona");
    inputZona.addEventListener("keydown", soloLetras);
    form.addEventListener("submit", async(e)=>{
        e.preventDefault();

        const zona = inputZona.value.trim();
        if (!zona) {
            alertaError("El campo no puede estar vacio")
            return
        }
        const objeto = {
            nombre_zona: zona
        }
        const respuesta = await post("zonas",objeto);
        try {
            if (respuesta.ok) {
                alertaExito("Se creo la zona correctamente")
            }
            else{
                alertaError("No fue posible crear la zona");
            }
        } catch (error) {
            console.error(error);
            alertaError("Error de servidor")
        }
    })
}
import { alertaError, alertaExito, confirmarAccion } from "../../../../componentes/sweetAlert";
import { del, get } from "../../../../utils/api";
import { nombreZona } from "../../../../validaciones/validacion";

export const adminPiercingController = async() =>{
    const tbody = document.querySelector(".tabla__cuerpo");
    const piercings = await get("piercings");
    
    for (const perfo of piercings) {
        
        const zona = document.createElement("td");
        const piercing = document.createElement("td");
        const precio = document.createElement("td");
        const fila = document.createElement("tr");
        const editar = document.createElement("td");
        const eliminar = document.createElement("td");

        const bt_editar = document.createElement("button");
        const bt_eliminar = document.createElement("button");
        
        piercing.classList.add("celda");
        precio.classList.add("celda");
        zona.classList.add("celda");
        editar.classList.add("celda");
        eliminar.classList.add("celda");
        fila.classList.add("fila");
        fila.dataset.id = perfo.id_piercing;
        bt_editar.classList.add("celda__boton");
        bt_eliminar.classList.add("celda__boton");

        const nomZona = await nombreZona(perfo.id_zona);
        piercing.textContent = perfo.nombre_piercing;
        precio.textContent = perfo.precio_piercing;
        zona.textContent = nomZona;
        bt_editar.textContent = "Editar";
        bt_eliminar.textContent = "Eliminar"

        editar.append(bt_editar);
        eliminar.append(bt_eliminar);
        fila.append(piercing,precio,zona,editar,eliminar);
        tbody.append(fila);

        bt_editar.addEventListener("click", () => {
            window.location.href = `#admin/piercing/editar/${perfo.id_piercing}`;
          });

        bt_eliminar.addEventListener("click", () =>{
            confirmarAccion("Espera","¿Estas seguro de eliminar este piercing?", async()=>{
                try {
                    const respuesta = await del(`piercings/${perfo.id_piercing}`);
                    if (respuesta.ok) {
                        alertaExito("se elimino el piercing");
                        fila.remove();
                    }
                    else{
                        alertaError("No fue posible eliminar el piercing");
                    }
                } catch (error) {
                    console.error(error);
                    alertaError("Error en el servidor")
                }
            })
        })
    }
}


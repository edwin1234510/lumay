import { alertaError, alertaExito, confirmarAccion } from "../../../../componentes/sweetAlert";
import { get, put } from "../../../../utils/api";
import { nombreZona, obtenerNombreEstadoPiercing } from "../../../../validaciones/validacion";

export const adminPiercingController = async() =>{
    const tbody = document.querySelector(".tabla__cuerpo");
    const piercings = await get("piercings");
    console.log(piercings); 
    
    for (const perfo of piercings) {
        const fila = document.createElement("tr");
        const piercing = document.createElement("td");
        const precio = document.createElement("td");
        const zona = document.createElement("td");
        const estado = document.createElement("td");
        const editar = document.createElement("td");
        const eliminar = document.createElement("td");

        const bt_editar = document.createElement("button");
        const bt_eliminar = document.createElement("button");

        piercing.classList.add("celda");
        precio.classList.add("celda");
        zona.classList.add("celda");
        estado.classList.add("celda");
        editar.classList.add("celda");
        eliminar.classList.add("celda");
        fila.classList.add("fila");
        fila.dataset.id = perfo.id_piercing;
        bt_editar.classList.add("celda__boton");
        bt_eliminar.classList.add("celda__boton");

        // Datos
        const nomZona = await nombreZona(perfo.id_zona);
        const nomEstado = await obtenerNombreEstadoPiercing(perfo.id_estado_piercing);

        piercing.textContent = perfo.nombre_piercing;
        precio.textContent = perfo.precio_piercing;
        zona.textContent = nomZona;
        estado.textContent = nomEstado;

        bt_editar.textContent = "Editar";
        bt_eliminar.textContent = "Eliminar";

        // Añadir elementos a la fila
        editar.append(bt_editar);
        eliminar.append(bt_eliminar);
        fila.append(piercing, precio, zona, estado, editar, eliminar);
        tbody.append(fila);

        bt_editar.addEventListener("click", () => {
            window.location.href = `#admin/piercing/editar/${perfo.id_piercing}`;
          });

        bt_eliminar.addEventListener("click", () =>{
            if (estado.textContent.trim() == "Inactivo") {
                alertaError("Ya fue eliminado el material");
                return;
            }
            confirmarAccion("Espera","¿Estas seguro de eliminar este piercing?", async()=>{
                try {
                    const objeto = { id_estado_piercing: 2}
                    const respuesta = await put(`piercings/${perfo.id_piercing}/estado`,objeto);
                    if (respuesta.ok) {
                        alertaExito("se elimino el piercing");
                        const nuevoNombreEstado = await obtenerNombreEstadoPiercing(objeto.id_estado_piercing)
                        estado.textContent = nuevoNombreEstado;
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


import { alertaError, alertaExito, confirmarAccion } from "../../../../componentes/sweetAlert";
import { get, put } from "../../../../utils/api";
import { obtenerNombreEstadoZona } from "../../../../validaciones/validacion";

export const adminZonaController = async () => {
    const tbody = document.querySelector(".tabla__cuerpo");

    const zonas = await get("zonas");
    console.log(zonas);
    for (const element of zonas) {
        const fila = document.createElement("tr");
        fila.classList.add("fila");
    
        const zona = document.createElement("td");
        const estado = document.createElement("td");
        const editar = document.createElement("td");
        const eliminar = document.createElement("td");
    
        zona.classList.add("celda");
        estado.classList.add("celda");
        editar.classList.add("celda");
        eliminar.classList.add("celda");
    
        const bt_editar = document.createElement("button");
        const bt_eliminar = document.createElement("button");
    
        bt_editar.textContent = "Editar";
        bt_eliminar.textContent = "Eliminar";
    
        bt_editar.classList.add("celda__boton");
        bt_eliminar.classList.add("celda__boton");
    
        bt_eliminar.setAttribute("data-id", element.id_zona);
    
        zona.textContent = element.nombre_zona;
        const nomEstado = await obtenerNombreEstadoZona(element.id_estado_zona)
        estado.textContent = nomEstado;
    
        editar.appendChild(bt_editar);
        eliminar.appendChild(bt_eliminar);
    
        fila.append(zona, estado, editar, eliminar);
        tbody.append(fila);
    
        bt_editar.addEventListener("click", () => {
            window.location = `#admin/zona/editar/${element.id_zona}`;
        });
    
        bt_eliminar.addEventListener("click", () => {
            if (estado.textContent.trim() == "Inactivo") {
                alertaError("Ya fue eliminado el material");
                return;
            }
            confirmarAccion("Espera", "¿Estás seguro de eliminar esta zona?", async () => {
                const id = element.id_zona;
                const objeto = {
                    id_estado_zona: 2
                };
                const respuesta = await put(`zonas/${id}/estado`, objeto);
                if (respuesta.ok) {
                    alertaExito("La zona se inactivo");
                    const nuevoNombreEstado = await obtenerNombreEstadoZona(objeto.id_estado_zona);
                estado.textContent = nuevoNombreEstado;
                } else {
                    console.error("Error al eliminar zona", respuesta);
                }
            });
        });
    }
};

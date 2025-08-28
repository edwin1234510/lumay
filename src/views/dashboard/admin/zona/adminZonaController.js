import { alertaError, alertaExito, confirmarAccion } from "../../../../componentes/sweetAlert"; 
import { get, put } from "../../../../utils/api";
import { obtenerNombreEstadoZona } from "../../../../validaciones/validacion";

/**
 * Controlador de administración de zonas.
 * 
 * Esta función construye dinámicamente la tabla de zonas en la vista de administración.
 * Se encarga de:
 *  - Obtener la lista de zonas desde el backend.
 *  - Renderizar cada zona en una fila de la tabla con opciones de editar y eliminar.
 *  - Permitir redirección hacia la pantalla de edición de una zona.
 *  - Inactivar (eliminar lógicamente) una zona cambiando su estado a "Inactivo".
 *  - Actualizar la tabla en tiempo real después de una modificación.
 * 
 * @async
 * @function adminZonaController
 * @returns {Promise<void>} No retorna ningún valor. Se limita a manipular el DOM
 *                          para renderizar las zonas y gestionar los eventos de usuario.
 */
export const adminZonaController = async () => {
    // Seleccionamos el cuerpo de la tabla donde se agregarán dinámicamente las filas
    const tbody = document.querySelector(".tabla__cuerpo");

    //  Obtener todas las zonas desde la API
    const zonas = await get("zonas");

    //  Recorrer las zonas obtenidas para crear filas dinámicas en la tabla
    for (const element of zonas) {
        const fila = document.createElement("tr");
        fila.classList.add("fila");

        // Crear celdas
        const zona = document.createElement("td");
        const estado = document.createElement("td");
        const editar = document.createElement("td");
        const eliminar = document.createElement("td");

        // Asignar clases para estilos
        zona.classList.add("celda");
        estado.classList.add("celda");
        editar.classList.add("celda");
        eliminar.classList.add("celda");

        // Crear botones de acción
        const bt_editar = document.createElement("button");
        const bt_eliminar = document.createElement("button");

        bt_editar.textContent = "Editar";
        bt_eliminar.textContent = "Eliminar";

        bt_editar.classList.add("celda__boton");
        bt_eliminar.classList.add("celda__boton");

        // Asignamos el id de la zona como atributo para identificarla en acciones
        bt_eliminar.setAttribute("data-id", element.id_zona);

        //  Insertar la información de la zona en la fila
        zona.textContent = element.nombre_zona;

        // Obtener nombre del estado de la zona mediante validación externa
        const nomEstado = await obtenerNombreEstadoZona(element.id_estado_zona);
        estado.textContent = nomEstado;

        // Insertar botones en sus respectivas celdas
        editar.appendChild(bt_editar);
        eliminar.appendChild(bt_eliminar);

        // Agregar las celdas a la fila y la fila al cuerpo de la tabla
        fila.append(zona, estado, editar, eliminar);
        tbody.append(fila);

        //  Evento para redirigir a la edición de una zona
        bt_editar.addEventListener("click", () => {
            window.location = `#admin/zona/editar/${element.id_zona}`;
        });

        //  Evento para eliminar (inactivar) una zona
        bt_eliminar.addEventListener("click", () => {
            // Validar si ya está inactiva
            if (estado.textContent.trim() == "Inactivo") {
                alertaError("Ya fue eliminada la zona");
                return;
            }

            // Confirmar acción antes de inactivar la zona
            confirmarAccion("Espera", "¿Estás seguro de eliminar esta zona?", async () => {
                try {
                    const id = element.id_zona;
                    const objeto = { id_estado_zona: 2 }; // Estado "Inactivo"

                    // Enviar petición PUT para actualizar el estado
                    await put(`zonas/${id}/estado`, objeto);
                    
                    // Mostrar alerta de éxito
                    alertaExito("La zona se inactivó");
                    
                    // Actualizar visualmente el estado en la tabla
                    const nuevoNombreEstado = await obtenerNombreEstadoZona(objeto.id_estado_zona);
                    estado.textContent = nuevoNombreEstado;
                } catch (error) {
                    console.error("Error al eliminar zona", error);
                    alertaError(error.message || "No se pudo eliminar la zona");
                }
            });
        });
    }
};

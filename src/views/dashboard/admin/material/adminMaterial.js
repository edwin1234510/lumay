import { alertaError, alertaExito, confirmarAccion } from "../../../../componentes/sweetAlert"; 
import { get, put } from "../../../../utils/api";
import { obtenerNombreEstadoMaterial } from "../../../../validaciones/validacion";

/**
 * Controlador para la administración de materiales.
 *
 * - Recupera la lista de materiales desde la API.
 * - Genera dinámicamente las filas de una tabla con información del material.
 * - Permite redirigir a la edición de un material.
 * - Permite inactivar un material (cambiar su estado a "Inactivo").
 *
 * @async
 * @function adminMaterialController
 * @returns {Promise<void>} No retorna un valor directo.
 *   Sus efectos son:
 *   - Rellenar la tabla HTML con los materiales obtenidos desde la API.
 *   - Asociar eventos a los botones de editar y eliminar de cada fila.
 *   - Actualizar el estado del material en la tabla y en la base de datos.
 */
export const adminMaterialController = async () => {
    // 🔹 Seleccionamos el cuerpo de la tabla donde se van a insertar las filas
    const tbody = document.querySelector(".tabla__cuerpo");

    // 🔹 Obtenemos todos los materiales desde la API
    const materiales = await get("materiales");

    // 🔹 Recorremos cada material para crear dinámicamente una fila en la tabla
    for (const material of materiales) {
        // Crear elementos <tr> y <td> para la fila
        const fila = document.createElement("tr");
        const tipoMaterial = document.createElement("td");
        const precio = document.createElement("td");
        const estado = document.createElement("td");
        const editar = document.createElement("td");
        const eliminar = document.createElement("td");

        // Crear botones de acción
        const bt_editar = document.createElement("button");
        const bt_eliminar = document.createElement("button");

        // 🔹 Agregar clases CSS para dar estilo
        fila.classList.add("fila");
        tipoMaterial.classList.add("celda");
        precio.classList.add("celda");
        estado.classList.add("celda");
        editar.classList.add("celda");
        eliminar.classList.add("celda");
        bt_editar.classList.add("celda__boton");
        bt_eliminar.classList.add("celda__boton");

        // Insertar la información del material en las celdas
        tipoMaterial.textContent = material.tipo_material; // Tipo de material
        precio.textContent = material.precio_material; // Precio del material

        // Obtener el nombre legible del estado (Activo/Inactivo) mediante helper
        const nomEstado = await obtenerNombreEstadoMaterial(material.id_estado_material);
        estado.textContent = nomEstado;

        // Asignar texto a los botones
        bt_editar.textContent = "Editar";
        bt_eliminar.textContent = "Eliminar";

        // Insertar los botones dentro de sus respectivas celdas
        editar.append(bt_editar);
        eliminar.append(bt_eliminar);

        //  Agregar todas las celdas a la fila
        fila.append(tipoMaterial, precio, estado, editar, eliminar);

        //  Finalmente insertar la fila en el <tbody>
        tbody.append(fila);

        //  EVENTOS DE LOS BOTONES
        // Botón Editar → redirige a la página de edición con el id del material
        bt_editar.addEventListener("click", () => {
            window.location.href = `#admin/material/editar/${material.id_material}`;
        });
        
        // Botón Eliminar → cambia el estado del material a "Inactivo"
        bt_eliminar.addEventListener("click", () => {
            // Si ya está inactivo, mostramos un error y no hacemos nada
            if (estado.textContent.trim() == "Inactivo") {
                alertaError("Ya fue eliminado el material");
                return;
            }

            // Confirmación antes de proceder con la inactivación
            confirmarAccion(
                "Espera", 
                "¿Estás seguro de inactivar este material?", 
                async () => {
                    try {
                        // Objeto con el nuevo estado del material
                        const objeto = { id_estado_material: 2 }; // 2 = Inactivo

                        // Llamada a la API para actualizar el estado
                        const respuesta = await put(`materiales/${material.id_material}/estado`, objeto);

                        // Mensaje de éxito
                        alertaExito("¡El material fue inactivado!");

                        // Actualizar el estado en la tabla con el nuevo nombre
                        const nuevoNombreEstado = await obtenerNombreEstadoMaterial(objeto.id_estado_material);
                        estado.textContent = nuevoNombreEstado;

                    } catch (error) {
                        // Si ocurre un error, lo mostramos en consola y en pantalla
                        console.error(error);
                        alertaError(error.message || "No fue posible inactivar el material");
                    }
                }
            );
        });
    }
};

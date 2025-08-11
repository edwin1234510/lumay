import { alertaError, alertaExito, confirmarAccion } from "../../../../componentes/sweetAlert";
import { get, put } from "../../../../utils/api";
import { obtenerNombreEstadoMaterial } from "../../../../validaciones/validacion";

export const adminMaterialController = async () => {
    const tbody = document.querySelector(".tabla__cuerpo");
    const materiales = await get("materiales");

    for (const material of materiales) {
        const fila = document.createElement("tr");
        const tipoMaterial = document.createElement("td");
        const precio = document.createElement("td");
        const estado = document.createElement("td");
        const editar = document.createElement("td");
        const eliminar = document.createElement("td");

        const bt_editar = document.createElement("button");
        const bt_eliminar = document.createElement("button");

        fila.classList.add("fila");
        tipoMaterial.classList.add("celda");
        precio.classList.add("celda");
        estado.classList.add("celda");
        editar.classList.add("celda");
        eliminar.classList.add("celda");
        bt_editar.classList.add("celda__boton");
        bt_eliminar.classList.add("celda__boton");

        tipoMaterial.textContent = material.tipo_material;
        precio.textContent = material.precio_material;

        // Obtener el nombre del estado
        const nomEstado = await obtenerNombreEstadoMaterial(material.id_estado_material);
        estado.textContent = nomEstado;

        bt_editar.textContent = "Editar";
        bt_eliminar.textContent = "Eliminar";

        editar.append(bt_editar);
        eliminar.append(bt_eliminar);
        fila.append(tipoMaterial, precio, estado, editar, eliminar);
        tbody.append(fila);

        bt_editar.addEventListener("click", () => {
            window.location.href = `#admin/material/editar/${material.id_material}`;
        });
        
        bt_eliminar.addEventListener("click", () => {
            if (estado.textContent.trim() == "Inactivo") {
                alertaError("Ya fue eliminado el material");
                return;
            }
            confirmarAccion("Espera", "¿Estás seguro de inactivar este material?", async () => {
                try {
                    const objeto = { id_estado_material: 2 };
                    const respuesta = await put(`materiales/${material.id_material}/estado`, objeto);
                    if (respuesta.ok) {
                        alertaExito("¡El material fue inactivado!");
                        const nuevoNombreEstado = await obtenerNombreEstadoMaterial(objeto.id_estado_material);
                        estado.textContent = nuevoNombreEstado;
                    } else {
                        alertaError("No fue posible inactivar el material");
                    }
                } catch (error) {
                    console.error(error);
                    alertaError("Error en el servidor");
                }
            });
        });
    }
};

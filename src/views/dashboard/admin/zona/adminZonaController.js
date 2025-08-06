import { confirmarAccion } from "../../../../componentes/sweetAlert";
import { del, get } from "../../../../utils/api";

export const adminZonaController = async () => {
    const tbody = document.querySelector(".tabla__cuerpo");

    const zonas = await get("zonas");
    console.log(zonas);

    zonas.forEach(element => {
        const fila = document.createElement("tr");
        fila.classList.add("fila");
        fila.setAttribute("data-id", element.id_zona); // ⚠️ Aquí asignas el id a la fila

        const zona = document.createElement("td");
        const editar = document.createElement("td");
        const eliminar = document.createElement("td");

        zona.classList.add("celda");
        editar.classList.add("celda");
        eliminar.classList.add("celda");

        const bt_editar = document.createElement("button");
        const bt_eliminar = document.createElement("button");

        bt_editar.textContent = "Editar";
        bt_eliminar.textContent = "Eliminar";

        bt_editar.classList.add("celda__boton");
        bt_eliminar.classList.add("celda__boton");
        bt_eliminar.setAttribute("data-id", element.id_zona); // ⚠️ Aquí asignas el id al botón

        zona.textContent = element.nombre_zona;
        editar.appendChild(bt_editar);
        eliminar.appendChild(bt_eliminar);

        fila.append(zona, editar, eliminar);
        tbody.append(fila);

        bt_editar.addEventListener("click", () => {
            window.location = `#admin/zona/editar/${element.id_zona}`;
        });

        bt_eliminar.addEventListener("click", () => {
            confirmarAccion("Espera", "¿Estás seguro de eliminar esta zona?", async () => {
                const id = element.id_zona;

                const respuesta = await del(`zonas/${id}`);
                if (respuesta?.status === "success" || respuesta?.ok) {
                    // Eliminar la fila del DOM
                    fila.remove();
                } else {
                    console.error("Error al eliminar zona", respuesta);
                }
            })();
        });
    });
};

import { alertaError, alertaExito, confirmarAccion } from "../../../../componentes/sweetAlert"; 
import { get, put } from "../../../../utils/api";
import { nombreZona, obtenerNombreEstadoPiercing } from "../../../../validaciones/validacion";

/**
 * Controlador del panel de administración de piercings.
 *
 * - Obtiene todos los piercings desde la API.
 * - Construye dinámicamente la tabla con la información de cada piercing.
 * - Permite editar o eliminar (inactivar) un piercing desde la interfaz.
 *
 * @async
 * @function adminPiercingController
 * @returns {Promise<void>} No retorna un valor directo.
 *   Sus efectos son:
 *   - Rellenar la tabla con piercings desde la API.
 *   - Redirigir al formulario de edición de un piercing.
 *   - Cambiar el estado de un piercing a "Inactivo" en la API.
 */
export const adminPiercingController = async () => {
  //  Seleccionar el cuerpo de la tabla donde se insertarán los registros
  const tbody = document.querySelector(".tabla__cuerpo");

  //  Obtener todos los piercings desde la API
  const piercings = await get("piercings");
  
  //  Recorrer cada piercing y crear una fila en la tabla
  for (const perfo of piercings) {
    // Crear elementos de la fila
    const fila = document.createElement("tr");
    const piercing = document.createElement("td");
    const precio = document.createElement("td");
    const zona = document.createElement("td");
    const estado = document.createElement("td");
    const editar = document.createElement("td");
    const eliminar = document.createElement("td");

    const bt_editar = document.createElement("button");
    const bt_eliminar = document.createElement("button");

    //  Agregar clases de estilo
    piercing.classList.add("celda");
    precio.classList.add("celda");
    zona.classList.add("celda");
    estado.classList.add("celda");
    editar.classList.add("celda");
    eliminar.classList.add("celda");
    fila.classList.add("fila");
    fila.dataset.id = perfo.id_piercing; // Guardar ID en dataset para referencia
    bt_editar.classList.add("celda__boton");
    bt_eliminar.classList.add("celda__boton");

    //  Obtener nombres legibles de zona y estado
    const nomZona = await nombreZona(perfo.id_zona);
    const nomEstado = await obtenerNombreEstadoPiercing(perfo.id_estado_piercing);

    //  Insertar datos en las celdas
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

    //  Insertar la fila en el tbody
    tbody.append(fila);

    //  Acción al dar clic en "Editar"
    bt_editar.addEventListener("click", () => {
      // Redirige al formulario de edición con el ID del piercing
      window.location.href = `#admin/piercing/editar/${perfo.id_piercing}`;
    });

    //  Acción al dar clic en "Eliminar"
    bt_eliminar.addEventListener("click", () => {
      // Evitar inactivar un piercing que ya está inactivo
      if (estado.textContent.trim() == "Inactivo") {
        alertaError("Ya fue eliminado el piercing");
        return;
      }

      // Confirmar la acción antes de proceder
      confirmarAccion("Espera", "¿Estás seguro de eliminar este piercing?", async () => {
        try {
          //  Cambiar el estado del piercing a "Inactivo"
          const objeto = { id_estado_piercing: 2 };
          await put(`piercings/${perfo.id_piercing}/estado`, objeto);

          //  Mostrar alerta de éxito
          alertaExito("El piercing se inactivó");

          //  Actualizar en la tabla el nuevo estado
          const nuevoNombreEstado = await obtenerNombreEstadoPiercing(objeto.id_estado_piercing);
          estado.textContent = nuevoNombreEstado;
        } catch (error) {
          //  Manejo de error en la petición
          console.error(error);
          alertaError(error.message || "No fue posible eliminar el piercing");
        }
      });
    });
  }
};

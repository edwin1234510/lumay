import { get } from "../../../../..//utils/api"; 
import { alertaExito, alertaError, confirmarAccion } from "../../../../../componentes/sweetAlert";

/**
 * Controlador para la vista de detalle de una carta en la galería.
 *
 * - Carga los datos de la carta seleccionada.
 * - Rellena el formulario con los datos actuales (imagen, cuidados y piercing).
 * - Permite actualizar los datos con un formulario (`PUT`).
 * - Permite eliminar la carta de la galería (`DELETE`).
 *
 * @async
 * @function galeriaDetalleController
 * @param {number|string} id_carta - ID de la carta que se desea visualizar, editar o eliminar.
 * @returns {Promise<void>} No retorna un valor directo, 
 *                          pero actualiza la UI, muestra alertas y redirige en caso de eliminación.
 */
export const galeriaDetalleController = async (id_carta) => {
  // Referencias a los elementos del DOM
  const formulario = document.querySelector("#cartaFormulario");
  const select = document.querySelector("#selectPiercing");
  const inputCuidados = document.querySelector("#inputCuidados");
  const archivoInput = document.querySelector("#archivo");
  const imagenVista = document.querySelector("#imagen");
  const btnEliminar = document.querySelector("#btnEliminar");

  // Obtener información de la carta desde la API
  const datos = await get("galeria");
  const carta = datos.find((item) => item.id_imagen == id_carta);

  if (!carta) {
    alertaError("Carta no encontrada"); // Mensaje si no se encuentra la carta
    return; // Termina la ejecución
  }

  //  Llenar datos en el formulario
  imagenVista.src = `http://localhost:8080/LumayJava/imagenes/${encodeURIComponent(carta.url_imagen)}`;
  inputCuidados.value = carta.cuidados;

  // Cargar opciones de piercings en el <select>
  const perforaciones = await get("piercings");
  select.innerHTML = ""; // Limpia las opciones previas
  perforaciones.forEach(perfo => {
    const option = document.createElement("option");
    option.value = perfo.id_piercing; // ID del piercing
    option.textContent = perfo.nombre_piercing; // Nombre que se muestra
    if (perfo.id_piercing == carta.id_piercing) option.selected = true; // Seleccionar el actual
    select.appendChild(option);
  });

  //  Guardar cambios en la carta (PUT)
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita el refresco de la página
    
    // Se obtienen los valores ingresados
    const idPiercing = select.value;
    const cuidados = inputCuidados.value.trim();
    const archivo = archivoInput.files[0];

    // Validación de campos obligatorios
    if (!idPiercing || !cuidados) {
      alertaError("Todos los campos son obligatorios");
      return;
    }

    // Se arma el objeto FormData con los datos a enviar
    const formData = new FormData();
    formData.append("id_piercing", idPiercing);
    formData.append("cuidados", cuidados);
    if (archivo) formData.append("archivo", archivo); // Si hay un archivo nuevo se envía

    // Se realiza la petición PUT para actualizar la carta
    const res = await fetch(`http://localhost:8080/LumayJava/api/galeria/${id_carta}`, {
      method: "PUT",
      body: formData,
    });

    // Manejo de respuesta
    if (res.ok) {
      alertaExito("Carta actualizada correctamente");
    } else {
      const error = await res.text();
      alertaError("Error al actualizar: " + error);
    }
  });

  // Eliminar carta de la galería (DELETE)
  btnEliminar.addEventListener("click", async () => {
    // Confirmación antes de eliminar
    confirmarAccion(
      "¿Eliminar?", 
      "¿Estás seguro de eliminar esta imagen?",
      async () => {
        // Petición DELETE para eliminar la carta
        const res = await fetch(`http://localhost:8080/LumayJava/api/galeria/${id_carta}`, {
          method: "DELETE"
        });
    
        if (res.ok) {
          alertaExito("Imagen eliminada");
          // Redirige al listado de galería tras eliminar
          window.location.href = "#admin/galeria";
        } else {
          const error = await res.text();
          alertaError("Error al eliminar: " + error);
        }
      }
    );
  });
};

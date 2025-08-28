import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert"; 
import { get, postFormData } from "../../../../..//utils/api"; 

/**
 * Función principal para crear una carta de cuidados de piercings.
 * 
 * - Carga los piercings desde la API y llena el `<select>` dinámicamente.
 * - Valida que el formulario tenga todos los campos completos.
 * - Envía los datos junto con un archivo al backend mediante `FormData`.
 * - Muestra mensajes de éxito o error con SweetAlert.
 * 
 * @async
 * @function crearCarta
 * @returns {Promise<void>} No retorna ningún valor directo, 
 *                          pero muestra alertas visuales y reinicia el formulario si la operación es exitosa.
 */
export const crearCarta = async () => {
  // Referencias a los elementos del formulario
  const formulario = document.querySelector("#cartaFormulario");
  const select = document.querySelector("#selectPiercing");
  const inputCuidados = document.querySelector("#inputCuidados");
  const archivoInput = document.querySelector("#archivo");
  
  console.log("Formulario encontrado:", formulario);

  // Cargar perforaciones en el select
  // Se obtienen las perforaciones desde la API (endpoint: "piercings")
  const perforaciones = await get("piercings");
  console.log("Perforaciones cargadas:", perforaciones);
  
  // Se recorre la lista de perforaciones para agregarlas como opciones al <select>
  perforaciones.forEach(perfo => {
    const option = document.createElement("option");
    option.value = perfo.id_piercing; // Valor del option = id de piercing
    option.textContent = perfo.nombre_piercing; // Texto visible = nombre del piercing
    select.appendChild(option); // Se agrega la opción al select
  });

  // Manejo del envío del formulario
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto de recargar la página

    // Extraer valores del formulario
    const idPiercing = select.value;
    const cuidados = inputCuidados.value.trim();
    const archivo = archivoInput.files[0];

    // Validación de campos obligatorios
    if (!idPiercing || !cuidados || !archivo) {
      alertaError("Todos los campos son obligatorios"); // Se muestra un error si falta algún campo
      return; // Se detiene la ejecución
    }

    // Preparar datos para enviar al backend
    const formData = new FormData();
    formData.append("id_piercing", idPiercing);
    formData.append("cuidados", cuidados);
    formData.append("archivo", archivo);


    // Envío de datos al backend
    const res = await postFormData("galeria", formData);


    // Manejo de la respuesta del backend
    if (res.ok) {
      const mensaje = await res.text(); 
      alertaExito(mensaje); // Muestra alerta de éxito
      formulario.reset(); // Limpia todos los campos del formulario
    } else {
      const error = await res.text();
      alertaError("Error al guardar: " + error); // Muestra alerta de error
    }
  });
};

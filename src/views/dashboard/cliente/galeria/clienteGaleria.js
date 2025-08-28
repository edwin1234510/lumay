import { alertaInfo } from "../../../../componentes/sweetAlert"; 
import { get } from "../../../../utils/api";
import { traerPerfo } from "../../../../validaciones/validacion";

/**
 * Controlador para mostrar la galería de piercings del cliente.
 * 
 * - Obtiene los datos de la galería desde la API (`get("galeria")`).
 * - Recorre cada elemento de la galería recibido.
 * - Por cada elemento crea dinámicamente una "carta" que contiene:
 *    - Imagen del piercing.
 *    - Información del piercing (nombre).
 *    - Botón para ver los cuidados asociados.
 * - Inserta cada carta dentro del contenedor con clase `.grid_galeria`.
 * 
 * @async
 * @function clienteGaleriaController
 * @returns {Promise<void>} No retorna un valor directo. Su efecto es
 *                          renderizar dinámicamente en el DOM las cartas
 *                          de la galería de piercings.
 */
export const clienteGaleriaController = async () => {
  // Selecciona el contenedor principal donde se mostrarán las cartas
  const galeria = document.querySelector(".grid_galeria");

  try {
    // Se hace una petición a la API para obtener todos los elementos de la galería
    const datos = await get("galeria");

    // Se recorre cada elemento recibido de la galería
    for (const i in datos) {
      const item = datos[i]; // Elemento actual de la galería

      // Creación de la estructura HTML
      // Contenedor principal (carta)
      const carta = document.createElement("div");
      carta.classList.add("cartas");

      // Imagen del piercing
      const imagen = document.createElement("img");
      imagen.classList.add("cartas__imagen");
      imagen.src = `http://localhost:8080/LumayJava/imagenes/${item.url_imagen}`; // URL de la imagen
      imagen.alt = "Imagen de piercing";

      // Contenedor para la información textual de la carta
      const informacion = document.createElement("div");
      informacion.classList.add("carta_informacion", "carta_informacion--gap");

      // Texto con el nombre del piercing
      const piercing = document.createElement("p");
      piercing.classList.add("carta_informacion__parrafo");
      
      // Se obtiene el nombre del piercing llamando a otra función que lo trae por ID
      const perfo = await traerPerfo(item.id_piercing);
      piercing.textContent = `Piercing: ${perfo.nombre_piercing}`;

      // Botón para mostrar los cuidados del piercing
      const cuidados = document.createElement("button");
      cuidados.classList.add("boton--cuidados");
      cuidados.textContent = `Cuidados`;

      // Evento click: al pulsar, muestra un modal con los cuidados del piercing
      cuidados.addEventListener("click", () => {
        alertaInfo("Cuidados", item.cuidados);
      });


      // Ensamblaje de la carta en el DOM
      informacion.appendChild(piercing);   // Añade el párrafo de nombre
      informacion.appendChild(cuidados);   // Añade el botón de cuidados
      carta.appendChild(imagen);           // Añade la imagen a la carta
      carta.appendChild(informacion);      // Añade la información a la carta
      
      // Finalmente, se inserta la carta en la galería
      galeria.appendChild(carta);
    }
  } catch (error) {
    // Manejo de errores en caso de fallo en la petición o renderizado
    console.error("Error al cargar la galería:", error);
  }
};

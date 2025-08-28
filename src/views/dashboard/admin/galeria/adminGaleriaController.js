import { alertaInfo } from "../../../../componentes/sweetAlert"; 
import { get } from "../../../../utils/api";
import { traerPerfo } from "../../../../validaciones/validacion";

/**
 *  Controlador para gestionar la galería del administrador.
 * 
 * Esta función obtiene la lista de imágenes desde la API,
 * genera dinámicamente las cartas (con imagen, información del piercing
 * y botones de acción), y las inserta dentro del contenedor `.grid_galeria`.
 * 
 * @async
 * @function adminGaleriaController
 * @returns {Promise<void>} No retorna un valor específico, 
 *                          pero modifica dinámicamente el DOM.
 */
export const adminGaleriaController = async () => {
  // Seleccionamos el contenedor donde se renderizarán las cartas de la galería
  const galeria = document.querySelector(".grid_galeria");

  try {
    //  Se obtienen los datos de la API (lista de imágenes en galería)
    const datos = await get("galeria");

    //  Recorremos cada elemento recibido desde la API
    for (const i in datos) {
      const item = datos[i]; // Cada objeto representa una imagen de galería

      //  Crear el contenedor principal (carta)
      const carta = document.createElement("div");
      carta.classList.add("cartas");

      //  Crear la imagen de la galería
      const imagen = document.createElement("img");
      imagen.classList.add("cartas__imagen");
      imagen.src = `http://localhost:8080/LumayJava/imagenes/${item.url_imagen}`;
      imagen.alt = "Imagen de piercing";

      //  Crear contenedor para la información de la carta
      const informacion = document.createElement("div");
      informacion.classList.add("carta_informacion");

      //  Mostrar el nombre del piercing asociado
      const piercing = document.createElement("p");
      piercing.classList.add("carta_informacion__parrafo");

      // Se obtiene información extra del piercing mediante su ID
      const perfo = await traerPerfo(item.id_piercing);
      piercing.textContent = `Piercing: ${perfo.nombre_piercing}`;

      //  Botón para mostrar los cuidados del piercing
      const cuidados = document.createElement("button");
      cuidados.classList.add("boton--cuidados");
      cuidados.textContent = `Cuidados`;

      // Evento para mostrar una alerta con los cuidados
      cuidados.addEventListener("click", () => {
        alertaInfo("Cuidados", item.cuidados);
      });

      //  Botón "Detalles" → redirige a la vista de detalles de la imagen
      const btnDetalle = document.createElement("a");
      btnDetalle.classList.add("boton--detalles");
      btnDetalle.textContent = "Detalles";

      btnDetalle.addEventListener("click", () => {
        // Redirección dinámica según el ID de la imagen
        window.location.href = `#admin/galeria/detalles/${item.id_imagen}`;
      });

      //  Se añaden los elementos dentro de la sección de información
      informacion.appendChild(piercing);
      informacion.appendChild(cuidados);
      informacion.appendChild(btnDetalle);

      //  Se arma la carta completa (imagen + información)
      carta.appendChild(imagen);
      carta.appendChild(informacion);

      // Finalmente, se agrega la carta al contenedor principal de la galería
      galeria.appendChild(carta);
    }
  } catch (error) {
    //  Captura y muestra errores si la API falla o no hay conexión
    console.error("Error al cargar la galería:", error);
  }
};

import { alertaInfo } from "../../../../componentes/sweetAlert";
import { get } from "../../../../utils/api";
import { traerPerfo } from "../../../../validaciones/validacion";

export const adminGaleriaController = async () => {
  const galeria = document.querySelector(".grid_galeria");

  try {
    const datos = await get("galeria");

    for (const i in datos) {
      const item = datos[i];

      const carta = document.createElement("div");
      carta.classList.add("cartas");

      const imagen = document.createElement("img");
      imagen.classList.add("cartas__imagen");
      imagen.src = `http://localhost:8080/LumayJava/imagenes/${item.url_imagen}`;
      imagen.alt = "Imagen de piercing";

      const informacion = document.createElement("div");
      informacion.classList.add("carta_informacion");

      const piercing = document.createElement("p");
      piercing.classList.add("carta_informacion__parrafo");
      const perfo = await traerPerfo(item.id_piercing);
      piercing.textContent = `Piercing: ${perfo.nombre_piercing}`;

      const cuidados = document.createElement("button");
      cuidados.classList.add("boton--cuidados");
      cuidados.textContent = `Cuidados`;
      cuidados.addEventListener("click", () => {
        alertaInfo("Cuidados", item.cuidados);
      });


      // 🔵 Botón Editar
      const btnDetalle = document.createElement("a");
      btnDetalle.classList.add("boton--detalles");
      btnDetalle.textContent = "Detalles";

      btnDetalle.addEventListener("click", ()=>{
        window.location.href = `#admin/galeria/detalles/${item.id_imagen}`;
      })


      informacion.appendChild(piercing);
      informacion.appendChild(cuidados);
      informacion.appendChild(btnDetalle)

      carta.appendChild(imagen);
      carta.appendChild(informacion);
      
      galeria.appendChild(carta);
    }
  } catch (error) {
    console.error("Error al cargar la galería:", error);
  }
};

import { alertaInfo } from "../../../../componentes/sweetAlert";
import { get } from "../../../../utils/api";
import { traerPerfo } from "../../../../validaciones/validacion";

export const clienteGaleriaController = async() =>{
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
      informacion.classList.add("carta_informacion", "carta_informacion--gap");

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

      informacion.appendChild(piercing);
      informacion.appendChild(cuidados);
      carta.appendChild(imagen);
      carta.appendChild(informacion);
      
      galeria.appendChild(carta);
    }
  } catch (error) {
    console.error("Error al cargar la galería:", error);
  }
}
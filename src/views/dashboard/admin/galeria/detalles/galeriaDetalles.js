import { get} from "../../../../..//utils/api";
import { alertaExito, alertaError,confirmarAccion } from "../../../../../componentes/sweetAlert";
export const galeriaDetalleController = async (id_carta) => {
  const formulario = document.querySelector("#cartaFormulario");
  const select = document.querySelector("#selectPiercing");
  const inputCuidados = document.querySelector("#inputCuidados");
  const archivoInput = document.querySelector("#archivo");
  const imagenVista = document.querySelector("#imagen");
  const btnEliminar = document.querySelector("#btnEliminar");

  // 1. Traer info de la carta
  const datos = await get("galeria");
  const carta = datos.find((item) => item.id_imagen == id_carta);

  if (!carta) {
    alertaError("Carta no encontrada");
    return;
  }

  // 2. Llenar datos
  imagenVista.src = `http://localhost:8080/LumayJava/imagenes/${encodeURIComponent(carta.url_imagen)}`;
  inputCuidados.value = carta.cuidados;

  // 3. Cargar opciones de piercing
  const perforaciones = await get("piercings");
  select.innerHTML = "";
  perforaciones.forEach(perfo => {
    const option = document.createElement("option");
    option.value = perfo.id_piercing;
    option.textContent = perfo.nombre_piercing;
    if (perfo.id_piercing == carta.id_piercing) option.selected = true;
    select.appendChild(option);
  });

  // 4. Guardar cambios
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idPiercing = select.value;
    const cuidados = inputCuidados.value.trim();
    const archivo = archivoInput.files[0];

    if (!idPiercing || !cuidados) {
      alertaError("Todos los campos son obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("id_piercing", idPiercing);
    formData.append("cuidados", cuidados);
    if (archivo) formData.append("archivo", archivo);

    const res = await fetch(`http://localhost:8080/LumayJava/api/galeria/${id_carta}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      alertaExito("Carta actualizada correctamente");
    } else {
      const error = await res.text();
      alertaError("Error al actualizar: " + error);
    }
  });

  // 5. Eliminar
  btnEliminar.addEventListener("click", async () => {
     confirmarAccion("¿Eliminar?", "¿Estás seguro de eliminar esta imagen?",async()=>{
        const res = await fetch(`http://localhost:8080/LumayJava/api/galeria/${id_carta}`, {
            method: "DELETE"
          });
      
          if (res.ok) {
            alertaExito("Imagen eliminada");
            window.location.href = "#admin/galeria";
          } else {
            const error = await res.text();
            alertaError("Error al eliminar: " + error);
          }
        });
    });


    
};

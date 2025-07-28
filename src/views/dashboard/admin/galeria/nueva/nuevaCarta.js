import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";
import { get, postFormData } from "../../../../..//utils/api"; // agrega aquí tu nueva función

export const crearCarta = async () => {
  const formulario = document.querySelector("#cartaFormulario");
  const select = document.querySelector("#selectPiercing");
  const inputCuidados = document.querySelector("#inputCuidados");
  const archivoInput = document.querySelector("#archivo");
  
  console.log("Formulario encontrado:", document.querySelector("#cartaFormulario"));
  // Cargar perforaciones
  const perforaciones = await get("piercings");
  console.log(perforaciones);
  

  perforaciones.forEach(perfo => {
    const option = document.createElement("option");
    option.value = perfo.id_piercing;
    option.textContent = perfo.nombre_piercing;
    select.appendChild(option);
  });

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validación
    const idPiercing = select.value;
    const cuidados = inputCuidados.value.trim();
    const archivo = archivoInput.files[0];

    if (!idPiercing || !cuidados || !archivo) {
      alertaError("Todos los campos son obligatorios");
      return;
    }

    // Enviar
    const formData = new FormData();
    formData.append("id_piercing", idPiercing);
    formData.append("cuidados", cuidados);
    formData.append("archivo", archivo);

    const res = await postFormData("galeria", formData);

    if (res.ok) {
      const mensaje = await res.text();
      alertaExito(mensaje);
      formulario.reset();
    } else {
      const error = await res.text();
      alertaExito(" Error al guardar: " + error);
    }
  });
};

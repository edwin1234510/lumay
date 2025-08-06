import { get, put } from "../../../../../utils/api";
import {alertaError, alertaExito} from "../../../../../componentes/sweetAlert"

export const editarPiercingController = async (id) => {
  const form = document.querySelector("#formPerfo");
  const inputNombre = document.querySelector("#piercing");
  const inputPrecio = document.querySelector("#precio");
  const selectZona = document.querySelector("#zona");

  if (!id) return; // Si no hay id, no estamos editando

  // Cargar zonas
  const zonas = await get("zonas");
  zonas.forEach(z => {
    const option = document.createElement("option");
    option.value = z.id_zona;
    option.textContent = z.nombre_zona;
    selectZona.appendChild(option);
  });

  // Obtener piercing por ID
  const piercings = await get("piercings");
  const piercing = piercings.find(p => p.id_piercing == id);

  if (!piercing) {
    alertaError("No se encontró el piercing");
    return;
  }

  // Llenar formulario
  inputNombre.value = piercing.nombre_piercing;
  inputPrecio.value = piercing.precio_piercing;
  selectZona.value = piercing.id_zona;

  // Manejar envío del formulario para actualizar
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validaciones básicas
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value.trim());
    const idZona = parseInt(selectZona.value);

    if (!nombre || isNaN(precio) || isNaN(idZona)) {
      alertaError("Por favor completa todos los campos correctamente.");
      return;
    }

    const nuevoPiercing = {
      nombre_piercing: nombre,
      precio_piercing: precio,
      id_zona: idZona
    };

    try {
      await put(`piercings/${id}`, nuevoPiercing);
      alertaExito("Piercing actualizado correctamente");
      window.location.href = "#admin/piercing"; // redirige
    } catch (error) {
      console.error("Error al actualizar:", error);
      alertaError("Error al actualizar el piercing");
    }
  });
};
